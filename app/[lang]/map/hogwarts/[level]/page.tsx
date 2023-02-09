import { getNodes } from '#/lib/nodes';
import FixedBox from '#/ui/FixedBox';
import Nodes from '#/ui/Nodes';
import SWRFallback from '#/ui/SWRFallback';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
const HogwartsMap = dynamic(() => import('#/ui/HogwartsMap'), { ssr: false });

const HOGWARTS_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44,
];
export default async function Page({
  params: { lang, level },
}: {
  params: { lang: string; level: string };
}) {
  const mapLevel = +level;
  if (!HOGWARTS_LEVELS.includes(mapLevel)) {
    notFound();
  }
  const nodes = await getNodes({ level: mapLevel });
  return (
    <div className="h-full-height w-screen fixed inset-0 top-14">
      <HogwartsMap level={mapLevel}>
        <FixedBox className="left-4 right-4 top-20 flex justify-center space-x-2">
          {HOGWARTS_LEVELS.map((level) => (
            <Link key={level} href={`/${lang}/map/hogwarts/${level}`}>
              {level}
            </Link>
          ))}
        </FixedBox>
        <SWRFallback fallback={{ [`nodes/hogwarts/${mapLevel}`]: nodes }}>
          <Nodes level={mapLevel} />
        </SWRFallback>
      </HogwartsMap>
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}
