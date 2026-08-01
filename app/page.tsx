import Shell from "./components/Shell";
import { getRotation } from "./lib/music";

export const revalidate = 21600;

export default async function Home() {
  const rotation = await getRotation();

  return (
    <main>
      <Shell rotation={rotation} />
    </main>
  );
}
