"use client";

import { useState } from "react";
import Loader from "./Loader";
import Landing from "./Landing";
import type { Rotation } from "@/app/lib/music";

export default function Shell({ rotation }: { rotation: Rotation }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      {loaded && <Landing rotation={rotation} />}
    </>
  );
}
