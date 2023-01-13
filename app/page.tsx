import Countdown from '#/ui/Countdown';
import DiscordLink from '#/ui/DiscordLink';

export default function Page() {
  return (
    <div className="grid place-content-center place-items-center gap-6 h-screen bg-cover bg-center bg-gray-1100 bg-[url('/Hogwarts_Legacy_Image_1.jpg')]">
      <h1 className="font-serif tracking-wide text-4xl sm:text-5xl drop-shadow-lg">
        Hogwart$.gg
      </h1>
      <p className="font-medium text-xl drop-shadow-md">
        Hogwarts Legacy Map and Tools
      </p>
      <Countdown />
      <DiscordLink />
    </div>
  );
}
