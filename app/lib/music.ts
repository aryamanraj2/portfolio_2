export type Track = {
  rank: number;
  title: string;
  artist: string;
  album: string | null;
  plays: number;
  art: string | null;
  preview: string | null;
  link: string | null;
};

export type Artist = {
  rank: number;
  name: string;
  plays: number;
  art: string | null;
  link: string | null;
};

export type Rotation = {
  period: string;
  updated: string;
  tracks: Track[];
  artists: Artist[];
};

const TRACK_COUNT = 5;
const ARTIST_COUNT = 3;
const FETCH_LIMIT = 10;
const SEARCH_DEPTH = 25;
const TIMEOUT_MS = 5000;
const ENRICH_CONCURRENCY = 3;

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const ITUNES = "https://itunes.apple.com/search";

const FEATURE = /\s*[([]\s*(?:feat|ft|featuring|with)\b\.?\s+[^)\]]*[)\]]\s*$/i;

export const FALLBACK: Rotation = {
  period: "Last 30 days",
  updated: "",
  tracks: [
    {
      rank: 1,
      title: "Nights",
      artist: "Frank Ocean",
      album: null,
      plays: 0,
      art: null,
      preview: null,
      link: null,
    },
    {
      rank: 2,
      title: "Praise The Lord",
      artist: "A$AP Rocky",
      album: null,
      plays: 0,
      art: null,
      preview: null,
      link: null,
    },
    {
      rank: 3,
      title: "No Idea",
      artist: "Don Toliver",
      album: null,
      plays: 0,
      art: null,
      preview: null,
      link: null,
    },
    {
      rank: 4,
      title: "Marvins Room",
      artist: "Drake",
      album: null,
      plays: 0,
      art: null,
      preview: null,
      link: null,
    },
    {
      rank: 5,
      title: "Sweet / I Thought You Wanted To Dance",
      artist: "Tyler, The Creator",
      album: null,
      plays: 0,
      art: null,
      preview: null,
      link: null,
    },
  ],
  artists: [
    { rank: 1, name: "Frank Ocean", plays: 0, art: null, link: null },
    { rank: 2, name: "A$AP Rocky", plays: 0, art: null, link: null },
    { rank: 3, name: "Don Toliver", plays: 0, art: null, link: null },
  ],
};

const list = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") return [value as T];
  return [];
};

const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const count = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

export const strip = (title: string): string => {
  const bare = title.replace(FEATURE, "").trim();
  return bare === "" ? title.trim() : bare;
};

const upscale = (url: string): string =>
  url.replace(/\/\d+x\d+bb\.(jpg|png)$/i, "/600x600bb.$1");

async function read(url: string, label: string): Promise<unknown> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "portfolio-rotation" },
    });
    if (!res.ok) {
      console.warn(`music: ${label} responded ${res.status}`);
      return null;
    }
    return await res.json();
  } catch {
    console.warn(`music: ${label} failed`);
    return null;
  }
}

function lastfm(method: string, key: string, user: string): string {
  const params = new URLSearchParams({
    method,
    user,
    api_key: key,
    period: "1month",
    limit: String(FETCH_LIMIT),
    format: "json",
  });
  return `${ENDPOINT}?${params.toString()}`;
}

type Raw = { title: string; artist: string; plays: number; link: string | null };

function parseTracks(payload: unknown): Raw[] {
  if (!payload || typeof payload !== "object") return [];
  const body = payload as Record<string, unknown>;
  if (body.error) {
    console.warn("music: getTopTracks returned an error body");
    return [];
  }
  const root = body.toptracks;
  if (!root || typeof root !== "object") return [];
  const rows = list<Record<string, unknown>>(
    (root as Record<string, unknown>).track,
  );

  return rows.flatMap((row) => {
    const title = text(row.name);
    const artistRaw = row.artist;
    const artist =
      artistRaw && typeof artistRaw === "object"
        ? text((artistRaw as Record<string, unknown>).name)
        : text(artistRaw);
    if (!title || !artist) return [];
    return [
      {
        title,
        artist,
        plays: count(row.playcount),
        link: text(row.url) || null,
      },
    ];
  });
}

function parseArtists(payload: unknown): Raw[] {
  if (!payload || typeof payload !== "object") return [];
  const body = payload as Record<string, unknown>;
  if (body.error) {
    console.warn("music: getTopArtists returned an error body");
    return [];
  }
  const root = body.topartists;
  if (!root || typeof root !== "object") return [];
  const rows = list<Record<string, unknown>>(
    (root as Record<string, unknown>).artist,
  );

  return rows.flatMap((row) => {
    const name = text(row.name);
    if (!name) return [];
    return [
      {
        title: name,
        artist: name,
        plays: count(row.playcount),
        link: text(row.url) || null,
      },
    ];
  });
}

function merge(rows: Raw[]): Raw[] {
  const bucket = new Map<string, Raw>();

  for (const row of rows) {
    const title = strip(row.title);
    const key = `${title.toLowerCase()} ${row.artist.toLowerCase()}`;
    const seen = bucket.get(key);
    if (seen) {
      seen.plays += row.plays;
      seen.link = seen.link ?? row.link;
      continue;
    }
    bucket.set(key, { ...row, title });
  }

  return [...bucket.values()].sort((a, b) => b.plays - a.plays);
}

const fold = (value: string): string =>
  strip(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const cache = new Map<string, Record<string, unknown> | null>();

async function search(
  params: Record<string, string>,
): Promise<Record<string, unknown>[]> {
  const query = new URLSearchParams({
    ...params,
    limit: String(SEARCH_DEPTH),
    media: "music",
  });
  const payload = await read(`${ITUNES}?${query.toString()}`, "itunes");
  if (!payload || typeof payload !== "object") return [];
  const rows = (payload as Record<string, unknown>).results;
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object",
  );
}

async function matchTrack(
  artist: string,
  title: string,
): Promise<Record<string, unknown> | null> {
  const key = `song ${fold(artist)} ${fold(title)}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const rows = await search({ term: `${artist} ${title}`, entity: "song" });
  const wantTitle = fold(title);
  const wantArtist = fold(artist);

  const match =
    rows.find((row) => {
      const gotTitle = fold(text(row.trackName));
      const gotArtist = fold(text(row.artistName));
      if (!gotTitle || !gotArtist || gotTitle !== wantTitle) return false;
      return gotArtist.includes(wantArtist) || wantArtist.includes(gotArtist);
    }) ?? null;

  cache.set(key, match);
  return match;
}

async function matchArtist(
  name: string,
): Promise<Record<string, unknown> | null> {
  const key = `artist ${fold(name)}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const rows = await search({
    term: name,
    entity: "album",
    attribute: "artistTerm",
  });
  const want = fold(name);

  const match = rows.find((row) => fold(text(row.artistName)) === want) ?? null;

  cache.set(key, match);
  return match;
}

async function pool<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;

  const lane = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await worker(items[i], i);
    }
  };

  const lanes = Array.from(
    { length: Math.min(ENRICH_CONCURRENCY, items.length) },
    lane,
  );
  await Promise.all(lanes);
  return out;
}

async function enrichTracks(rows: Raw[]): Promise<Track[]> {
  return pool(rows, async (row, i) => {
    const base: Track = {
      rank: i + 1,
      title: row.title,
      artist: row.artist,
      album: null,
      plays: row.plays,
      art: null,
      preview: null,
      link: row.link,
    };

    const match = await matchTrack(row.artist, row.title);
    if (!match) return base;

    const art = text(match.artworkUrl100);
    return {
      ...base,
      album: text(match.collectionName) || null,
      art: art ? upscale(art) : null,
      preview: text(match.previewUrl) || null,
      link: text(match.trackViewUrl) || base.link,
    };
  });
}

async function enrichArtists(rows: Raw[]): Promise<Artist[]> {
  return pool(rows, async (row, i) => {
    const base: Artist = {
      rank: i + 1,
      name: row.title,
      plays: row.plays,
      art: null,
      link: row.link,
    };

    const match = await matchArtist(row.title);
    if (!match) return base;

    const art = text(match.artworkUrl100);
    return {
      ...base,
      art: art ? upscale(art) : null,
      link: text(match.artistViewUrl) || base.link,
    };
  });
}

export async function getRotation(): Promise<Rotation> {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;

  if (!key || !user) {
    console.warn("music: credentials missing, serving fallback");
    return FALLBACK;
  }

  const [trackPayload, artistPayload] = await Promise.all([
    read(lastfm("user.getTopTracks", key, user), "getTopTracks"),
    read(lastfm("user.getTopArtists", key, user), "getTopArtists"),
  ]);

  const rawTracks = merge(parseTracks(trackPayload)).slice(0, TRACK_COUNT);
  const rawArtists = merge(parseArtists(artistPayload)).slice(0, ARTIST_COUNT);

  if (rawTracks.length === 0 && rawArtists.length === 0) return FALLBACK;

  const [tracks, artists] = await Promise.all([
    enrichTracks(rawTracks),
    enrichArtists(rawArtists),
  ]);

  return {
    period: "Last 30 days",
    updated: new Date().toISOString(),
    tracks,
    artists,
  };
}
