import { useSetPlayerPosition } from '#/lib/hooks/use-player-position';
import { getLevelByZ } from '#/lib/map';
import type { SavefilePlayer } from '#/lib/savefiles';
import { bodyToFile, readSavegame } from '#/lib/savefiles';
import { cn } from '#/lib/utils';
import { formatDistance } from 'date-fns';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import Stack from '../Stack';

type MESSAGE_STATUS = {
  type: string;
  toggleAppHotkeyBinding: string;
  savegame: {
    name: string;
    path: string;
    body: string;
    lastUpdate: string;
  } | null;
  overlay: boolean;
};

export default function Status() {
  const [status, setStatus] = useState<MESSAGE_STATUS | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setPlayerPosition = useSetPlayerPosition();
  const savegame = status?.savegame || null;

  useEffect(() => {
    postMessage({
      type: 'href',
      href: `${pathname}?${searchParams.toString()}`,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (savegame) {
      const file = bodyToFile(savegame.body);
      readSavegame(file).then((player) => setPlayerPosition(player.position));
    }
  }, [savegame, setPlayerPosition]);

  useEffect(() => {
    const handleMessage = (message: MessageEvent) => {
      const data = message.data as unknown;
      if (
        !data ||
        typeof data !== 'object' ||
        !('type' in data) ||
        typeof data.type !== 'string'
      ) {
        return;
      }
      if (data.type === 'status') {
        const status = data as MESSAGE_STATUS;
        setStatus(status);
      }
    };
    window.addEventListener('message', handleMessage);

    postMessage({ type: 'status' });
  }, []);

  return (
    <Stack className="p-2 h-full text-left">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
      <p className="text-orange-500 text-sm">
        This app is in development! Right now, only Hogwarts map is available
        and some nodes are missing.
      </p>
      <div>
        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={status?.overlay ?? true}
            onChange={() => postMessage({ type: 'overlay' })}
          />
          <span>Activate Overlay</span>
        </label>
        <p className="text-xs text-gray-500">
          This window is only visible as overlay in-game. Deactivate it, if you
          like to move this window to second screen or to ALT+TAB it.
        </p>
      </div>
      <p className="text-sm">
        Show/Hide app
        <button
          className="ml-2 font-mono bg-gray-900 hover:bg-gray-800 border rounded py-0.5 px-1  w-fit"
          onClick={() => postMessage({ type: 'hotkey_binding' })}
        >
          {status?.toggleAppHotkeyBinding ?? 'Unknown'}
        </button>
      </p>
      <h4 className="text-md">Latest Savegame</h4>
      <SaveGame savegame={savegame} />
    </Stack>
  );
}

function postMessage(message: { type: string; [key: string]: any }) {
  window.top!.postMessage(message, '*');
}

function SaveGame({ savegame }: { savegame: MESSAGE_STATUS['savegame'] }) {
  const [player, setPlayer] = useState<SavefilePlayer | null>(null);
  const [timeDistance, setTimeDistance] = useState('');

  useEffect(() => {
    if (!savegame) {
      return;
    }
    (async () => {
      const file = bodyToFile(savegame.body);
      const player = await readSavegame(file);
      setPlayer(player);
    })();
  }, [savegame]);

  useEffect(() => {
    if (!savegame) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeDistance(
        formatDistance(new Date(savegame.lastUpdate), new Date(), {
          addSuffix: true,
          includeSeconds: true,
        }),
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [savegame]);

  return (
    <div
      className={cn(
        'flex flex-col text-left w-full outline-none hover:bg-gray-900 transition-colors border-l-4 p-1 border-l-brand-500',
      )}
    >
      <p>{savegame?.name} </p>
      <div>
        {savegame && player ? (
          <>
            <p>
              <b>
                {player.firstName} {player.lastName}
              </b>{' '}
              | <b>{player.houseId}</b> | <b>{player.year}th</b> year
            </p>
            <p>
              <b>{player.position.world}</b> level{' '}
              <b>{getLevelByZ(player.position.z)}</b>
            </p>
            <p className="text-sm text-gray-400">
              <time dateTime={savegame.lastUpdate}>{timeDistance}</time>
            </p>
          </>
        ) : (
          <>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </>
        )}
      </div>
    </div>
  );
}
