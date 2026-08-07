"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import Landing from "./Landing";
import type { Rotation } from "@/app/lib/music";

const SEEN = "intro";

export default function Shell({ rotation }: { rotation: Rotation }) {
  const [loaded, setLoaded] = useState(false);
  const [greet, setGreet] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN)) {
      setGreet(false);
      setLoaded(true);
      return;
    }
    sessionStorage.setItem(SEEN, "1");
  }, []);

  return (
    <>
      {greet && !loaded && <Loader onDone={() => setLoaded(true)} />}
      <Landing rotation={rotation} start={loaded} />
    </>
  );
}
