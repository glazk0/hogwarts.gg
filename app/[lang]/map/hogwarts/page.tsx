import { HOGWARTS_LEVELS } from '#/lib/map';
import AddNode from '#/ui/AddNode';
import FixedBox from '#/ui/FixedBox';
import HogwartsLevelSelect from '#/ui/HogwartsLevelSelect';
import Nodes from '#/ui/Nodes';
import nextDynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
const HogwartsMap = nextDynamic(() => import('#/ui/HogwartsMap'), {
  ssr: false,
});

export default async function Page({
  params: { lang },
  searchParams: { level },
}: {
  params: { lang: string };
  searchParams: { level?: string };
}) {
  if (!level) {
    redirect(`/${lang}/map/hogwarts?page=1`);
  }
  const mapLevel = +level;
  if (!HOGWARTS_LEVELS.includes(mapLevel)) {
    notFound();
  }
  return (
    <div className="h-full-height w-screen fixed inset-0 top-14">
      <HogwartsMap level={mapLevel}>
        <FixedBox className="right-4 top-20 flex justify-center space-x-2">
          <AddNode />
        </FixedBox>
        <FixedBox className="left-4 bottom-4 flex justify-center space-x-2">
          <HogwartsLevelSelect lang={lang} />
        </FixedBox>
        <Nodes lang={lang} />
      </HogwartsMap>
    </div>
  );
}
