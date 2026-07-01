"use client";

import { useState } from "react";
import Loader from "./components/Loader";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {/* Placeholder home — real sections come next. */}
      <section
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          opacity: loaded ? 1 : 0,
          transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.06em",
            opacity: 0.5,
          }}
        >
          aryaman — portfolio (coming together)
        </p>
      </section>
    </main>
  );
}
