import FixedBox from '#/ui/FixedBox';
import Login from '#/ui/Login';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('#/ui/ExampleMap'), { ssr: false });

export default function Page() {
  return (
    <div className="h-screen w-screen fixed">
      <FixedBox className="right-6 top-6">
        <Login />
      </FixedBox>
      <Map />
    </div>
  );
}
