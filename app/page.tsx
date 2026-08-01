import Shell from "./components/Shell";
import { getRotation } from "./lib/music";
import { homeJsonLd } from "./lib/site";

export const revalidate = 21600;

export default async function Home() {
  const rotation = await getRotation();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />
      <Shell rotation={rotation} />
    </main>
  );
}
