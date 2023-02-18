import { useSetPlayerPosition } from '#/lib/hooks/use-player-position';
import { getLevelByZ } from '#/lib/map';
import type { SavefilePlayer } from '#/lib/savefiles';
import { bodyToFile, readSavegame } from '#/lib/savefiles';
import { cn } from '#/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import Stack from '../Stack';

type MESSAGE_STATUS = {
  type: string;
  toggleAppHotkeyBinding: string;
  savegames: {
    name: string;
    path: string;
    body: string;
  }[];
};

export default function Status() {
  const [status, setStatus] = useState<MESSAGE_STATUS | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSavegame, setSelectedSavegame] = useState<
    MESSAGE_STATUS['savegames'][number] | null
  >(null);
  const setPlayerPosition = useSetPlayerPosition();

  useEffect(() => {
    postMessage({
      type: 'href',
      href: `${pathname}?${searchParams.toString()}`,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (selectedSavegame) {
      const file = bodyToFile(selectedSavegame.body);
      readSavegame(file).then((player) => setPlayerPosition(player.position));
    }
  }, [selectedSavegame]);

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
        if (status.savegames[0]) {
          setSelectedSavegame(status.savegames[0]);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    postMessage({ type: 'status' });
  }, []);

  return (
    <Stack className="p-2 h-full">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
      <p className="text-center">
        Show/Hide app:{' '}
        <span
          className="font-mono bg-gray-900 hover:bg-gray-800 border rounded py-0.5 px-1 cursor-pointer"
          onClick={() => postMessage({ type: 'hotkey_binding' })}
        >
          {status?.toggleAppHotkeyBinding}
        </span>
      </p>
      <h4 className="text-lg">Savegames</h4>
      <ul className="flex-1 overflow-auto">
        {status?.savegames.map((savegame) => (
          <li key={savegame.name}>
            <SaveGame
              savegame={savegame}
              active={savegame.name === selectedSavegame?.name}
              onClick={() => setSelectedSavegame(savegame)}
            />
          </li>
        ))}
      </ul>
    </Stack>
  );
}

function postMessage(message: { type: string; [key: string]: any }) {
  window.top!.postMessage(message, '*');
}

function SaveGame({
  savegame,
  active,
  onClick,
}: {
  savegame: MESSAGE_STATUS['savegames'][number];
  active: boolean;
  onClick: () => void;
}) {
  const [player, setPlayer] = useState<SavefilePlayer | null>(null);

  useEffect(() => {
    (async () => {
      const file = bodyToFile(savegame.body);
      const player = await readSavegame(file);
      setPlayer(player);
    })();
  }, [savegame]);

  return (
    <button
      className={cn(
        'flex flex-col text-left w-full outline-none hover:bg-gray-900 transition-colors border-b border-gray-800 border-l-4 p-1 border-l-transparent',
        {
          'border-l-brand-500': active,
        },
      )}
      onClick={onClick}
    >
      <p>{savegame.name}</p>
      <div>
        {player ? (
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
          </>
        ) : (
          <>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </>
        )}
      </div>
    </button>
  );
}
