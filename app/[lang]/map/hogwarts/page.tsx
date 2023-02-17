import FixedBox from '#/ui/FixedBox';
import AddNode from '#/ui/map/AddNode';
import HogwartsLevelSelect from '#/ui/map/HogwartsLevelSelect';
import Nodes from '#/ui/map/Nodes';
import Player from '#/ui/map/Player';
import PlayerSync from '#/ui/PlayerSync';
import nextDynamic from 'next/dynamic';
const HogwartsMap = nextDynamic(() => import('#/ui/map/HogwartsMap'), {
  ssr: false,
});

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return (
    <div className="h-full-height w-full relative">
      <HogwartsMap>
        <FixedBox className="right-4 top-4 flex justify-center space-x-2">
          <AddNode />
          <PlayerSync />
        </FixedBox>
        <FixedBox className="left-4 bottom-0 flex justify-center space-x-2">
          <HogwartsLevelSelect />
          <Player />
        </FixedBox>
        <Nodes lang={lang} />
      </HogwartsMap>
    </div>
  );
}
