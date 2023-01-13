import dynamic from 'next/dynamic';
const Map = dynamic(() => import('#/ui/ExampleMap'), { ssr: false });

export default function Page() {
  return (
    <div className="h-screen w-screen fixed">
      <Map />
    </div>
  );
}
