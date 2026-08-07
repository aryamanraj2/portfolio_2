"use client";

import { useState } from "react";
import type { Video } from "@/app/lib/apps";
import styles from "./Reel.module.css";

export default function Reel({ video }: { video: Video }) {
  const [live, setLive] = useState(false);
  const ready = video.id.length > 0;

  return (
    <figure className={styles.reel}>
      {live ? (
        <div className={styles.stage}>
          <iframe
            className={styles.frame}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : ready ? (
        <button
          type="button"
          className={`${styles.stage} halftone`}
          onClick={() => setLive(true)}
        >
          <span className={styles.play}>▶ play</span>
        </button>
      ) : (
        <div
          className={`${styles.stage} halftone`}
          role="img"
          aria-label={`${video.caption}, video placeholder`}
        />
      )}

      <figcaption className={styles.caption}>
        <span>{video.caption}</span>
        <span className={styles.runtime}>{video.runtime}</span>
      </figcaption>

      <p className={styles.note}>
        <span className={styles.marker}>((1))</span> nothing is requested from
        youtube until you press play.{" "}
        <span className={styles.marker}>((2))</span> served from
        youtube-nocookie.com.
      </p>
    </figure>
  );
}
