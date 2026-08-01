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
const CATALOG_DEPTH = 200;
const SINGLE_MAX = 2;
const TIMEOUT_MS = 5000;
const ENRICH_CONCURRENCY = 3;

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const ITUNES = "https://itunes.apple.com/search";
const LOOKUP = "https://itunes.apple.com/lookup";

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

function lastfm(method: string, key: string, extra: Record<string, string>) {
  const params = new URLSearchParams({
    method,
    api_key: key,
    format: "json",
    ...extra,
  });
  return `${ENDPOINT}?${params.toString()}`;
}

function chart(method: string, key: string, user: string): string {
  return lastfm(method, key, {
    user,
    period: "1month",
    limit: String(FETCH_LIMIT),
  });
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

const tight = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const cache = new Map<string, Record<string, unknown> | null>();

async function search(
  params: Record<string, string>,
  depth: number = SEARCH_DEPTH,
): Promise<Record<string, unknown>[]> {
  const query = new URLSearchParams({
    ...params,
    limit: String(depth),
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
  const wantArtist = tight(artist);

  const match =
    rows.find((row) => {
      const gotTitle = fold(text(row.trackName));
      const gotArtist = tight(text(row.artistName));
      if (!gotTitle || !gotArtist || gotTitle !== wantTitle) return false;
      return gotArtist.includes(wantArtist) || wantArtist.includes(gotArtist);
    }) ?? null;

  cache.set(key, match);
  return match;
}

async function albumOf(
  key: string,
  artist: string,
  title: string,
): Promise<string | null> {
  const payload = await read(
    lastfm("track.getInfo", key, { artist, track: title }),
    "track.getInfo",
  );
  if (!payload || typeof payload !== "object") return null;
  const body = payload as Record<string, unknown>;
  if (body.error) return null;
  const track = body.track;
  if (!track || typeof track !== "object") return null;
  const album = (track as Record<string, unknown>).album;
  if (!album || typeof album !== "object") return null;
  return text((album as Record<string, unknown>).title) || null;
}

type Catalog = {
  link: string | null;
  albums: Record<string, unknown>[];
};

const catalogs = new Map<string, Promise<Catalog | null>>();

function artistCatalog(name: string): Promise<Catalog | null> {
  const key = tight(name);
  const hit = catalogs.get(key);
  if (hit) return hit;

  const job = (async (): Promise<Catalog | null> => {
    const found = await search({ term: name, entity: "musicArtist" }, 10);
    const artist = found.find((row) => tight(text(row.artistName)) === key);
    if (!artist) return null;

    const id = count(artist.artistId);
    if (!id) return null;

    const payload = await read(
      `${LOOKUP}?id=${id}&entity=album&limit=${CATALOG_DEPTH}`,
      "itunes lookup",
    );
    const rows =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>).results
        : null;

    const albums = Array.isArray(rows)
      ? rows.filter(
          (row): row is Record<string, unknown> =>
            Boolean(row) &&
            typeof row === "object" &&
            text((row as Record<string, unknown>).wrapperType) === "collection",
        )
      : [];

    return { link: text(artist.artistLinkUrl) || null, albums };
  })();

  catalogs.set(key, job);
  return job;
}

const newest = (rows: Record<string, unknown>[]) =>
  [...rows].sort(
    (a, b) => Date.parse(text(b.releaseDate)) - Date.parse(text(a.releaseDate)),
  )[0] ?? null;

function coverOf(catalog: Catalog): Record<string, unknown> | null {
  const albums = catalog.albums.filter(
    (row) => count(row.trackCount) > SINGLE_MAX,
  );
  return newest(albums.length > 0 ? albums : catalog.albums);
}

function albumIn(
  catalog: Catalog,
  album: string,
): Record<string, unknown> | null {
  const want = fold(album);
  if (!want) return null;
  return (
    catalog.albums.find((row) => {
      const got = fold(text(row.collectionName));
      return Boolean(got) && (got.includes(want) || want.includes(got));
    }) ?? null
  );
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

async function enrichTracks(rows: Raw[], key: string): Promise<Track[]> {
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
    if (match) {
      const art = text(match.artworkUrl100);
      return {
        ...base,
        album: text(match.collectionName) || null,
        art: art ? upscale(art) : null,
        preview: text(match.previewUrl) || null,
        link: text(match.trackViewUrl) || base.link,
      };
    }

    const album = await albumOf(key, row.artist, row.title);
    if (!album) return base;

    const catalog = await artistCatalog(row.artist);
    const cover = catalog ? albumIn(catalog, album) : null;
    if (!cover) return { ...base, album };

    const art = text(cover.artworkUrl100);
    return {
      ...base,
      album: text(cover.collectionName) || album,
      art: art ? upscale(art) : null,
      link: text(cover.collectionViewUrl) || base.link,
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

    const catalog = await artistCatalog(row.title);
    if (!catalog) return base;

    const cover = coverOf(catalog);
    const art = cover ? text(cover.artworkUrl100) : "";
    return {
      ...base,
      art: art ? upscale(art) : null,
      link: catalog.link || base.link,
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
    read(chart("user.getTopTracks", key, user), "getTopTracks"),
    read(chart("user.getTopArtists", key, user), "getTopArtists"),
  ]);

  const rawTracks = merge(parseTracks(trackPayload)).slice(0, TRACK_COUNT);
  const rawArtists = merge(parseArtists(artistPayload)).slice(0, ARTIST_COUNT);

  if (rawTracks.length === 0 && rawArtists.length === 0) return FALLBACK;

  const [tracks, artists] = await Promise.all([
    enrichTracks(rawTracks, key),
    enrichArtists(rawArtists),
  ]);

  return {
    period: "Last 30 days",
    updated: new Date().toISOString(),
    tracks,
    artists,
  };
}
