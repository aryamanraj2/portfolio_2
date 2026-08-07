import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { APPS, bySlug } from "@/app/lib/apps";
import { NAME, appJsonLd } from "@/app/lib/site";
import Emphasis from "@/app/components/Emphasis";
import Rail from "@/app/components/spec/Rail";
import Ticker from "@/app/components/spec/Ticker";
import Mark from "@/app/components/spec/Mark";
import Reel from "@/app/components/spec/Reel";
import Features from "@/app/components/spec/Features";
import Plates from "@/app/components/spec/Plates";
import Sheet from "@/app/components/spec/Sheet";
import Matrix from "@/app/components/spec/Matrix";
import Log from "@/app/components/spec/Log";
import Index from "@/app/components/spec/Index";
import styles from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return APPS.map((app) => ({ slug: app.slug }));
}

const summarise = (slug: string) => {
  const app = bySlug(slug);
  if (!app) return "";
  return `${app.title} — ${app.claim.toLowerCase()}. ${app.highlights[0].toLowerCase()}. Built by ${NAME}.`;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const app = bySlug(slug);
  if (!app) return {};

  const description = summarise(slug);
  const url = `/apps/${app.slug}`;

  return {
    title: app.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${app.title} — ${NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.title} — ${NAME}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function AppPage({ params }: Params) {
  const { slug } = await params;
  const app = bySlug(slug);
  if (!app) notFound();

  const position = APPS.findIndex((entry) => entry.slug === app.slug) + 1;

  let counted = 0;
  const step = () => (++counted).toString().padStart(2, "0");

  return (
    <main
      className={styles.page}
      style={
        { "--hot": app.hot, "--hot-ink": app.hotInk } as CSSProperties
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appJsonLd(app, summarise(app.slug))),
        }}
      />

      <Rail part={app.part} position={position} total={APPS.length} />
      <div className={styles.invert}>
        <Ticker claim={app.claim} />
      </div>

      <header className={styles.masthead}>
        <span className={styles.part}>{app.part}</span>
        <h1 className={styles.wordmark}>{app.wordmark}</h1>
        <p className={styles.claim}>{app.claim}</p>
        <ul className={styles.meta}>
          {app.meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {app.awards.length > 0 && (
          <ul className={styles.awards}>
            {app.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        )}
      </header>

      <a
        className={styles.repo}
        href={app.repo}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span className={styles.repoLabel}>REPO ↗</span>
        <span className={styles.repoHost}>{app.repoHost}</span>
      </a>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> what it is
        </h2>
        <p className={styles.note}>
          <Emphasis parts={app.note} />
        </p>
      </section>

      {app.video && (
        <section className={styles.section}>
          <h2 className={styles.head}>
            <span className={styles.headNum}>{step()}</span> the reel
          </h2>
          <Reel video={app.video} />
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> the mark
        </h2>
        <Mark wordmark={app.wordmark} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> how it works
        </h2>
        <Features features={app.features} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> plates
        </h2>
        <Plates plates={app.plates} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> datasheet
        </h2>
        <Sheet
          highlights={app.highlights}
          specs={app.specs}
          derived={app.derived}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> privacy
        </h2>
        <Matrix privacy={app.privacy} line={app.privacyLine} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> log
        </h2>
        <Log log={app.log} />
      </section>

      <div className={styles.void} aria-hidden="true">
        <div className={`${styles.voidMark} halftone`} />
      </div>

      <section className={`${styles.section} ${styles.tail}`}>
        <h2 className={styles.head}>
          <span className={styles.headNum}>{step()}</span> the rest
        </h2>
      </section>
      <Index current={app.slug} />

      <footer className={styles.colophon}>
        <span>{app.part}</span>
        <span>{app.wordmark}</span>
        <span>
          <a href={app.repo} target="_blank" rel="noreferrer noopener">
            {app.repoHost}
          </a>
        </span>
        <span>{NAME}</span>
      </footer>
    </main>
  );
}
