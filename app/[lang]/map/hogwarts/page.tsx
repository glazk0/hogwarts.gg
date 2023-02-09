import AddNode from '#/ui/AddNode';
import FixedBox from '#/ui/FixedBox';
import HogwartsLevelSelect from '#/ui/HogwartsLevelSelect';
import Nodes from '#/ui/Nodes';
import nextDynamic from 'next/dynamic';
const HogwartsMap = nextDynamic(() => import('#/ui/HogwartsMap'), {
  ssr: false,
});

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return (
    <div className="h-full-height w-screen fixed inset-0 top-14">
      <HogwartsMap>
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
