"use client";

import { useState } from "react";
import Loader from "./components/Loader";
import Landing from "./components/Landing";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      {loaded && <Landing />}
    </main>
  );
}
