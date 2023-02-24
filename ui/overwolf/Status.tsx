import { useSetPlayerPosition } from '#/lib/hooks/use-player-position';
import { postMessage } from '#/lib/messages';
import type { SavefilePlayer } from '#/lib/savefiles';
import { bodyToFile, readSavegame } from '#/lib/savefiles';
import { cn } from '#/lib/utils';
import { IconHelp } from '@tabler/icons-react';
import { formatDistance } from 'date-fns';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import Stack from '../Stack';
import Tooltip from '../Tooltip';

export type MESSAGE_STATUS = {
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

export type MESSAGE_REALTIME = {
  type: 'realtime';
  hlIsRunning: boolean;
  position: {
    x: number;
    y: number;
    z: number;
    pitch: number;
    roll: number;
    yaw: number;
  } | null;
};

export default function Status() {
  const [status, setStatus] = useState<MESSAGE_STATUS | null>(null);
  const [realtime, setRealtime] = useState<MESSAGE_REALTIME | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setPlayerPosition = useSetPlayerPosition();
  const savegame = status?.savegame || null;
  const { mutate } = useSWRConfig();

  useEffect(() => {
    postMessage({
      type: 'href',
      href: `${pathname}?${searchParams.toString()}`,
    });
  }, [pathname, searchParams]);

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
      switch (data.type) {
        case 'status':
          {
            const status = data as MESSAGE_STATUS;
            setStatus(status);
          }
          break;
        case 'realtime':
          {
            const realtime = data as MESSAGE_REALTIME;
            setPlayerPosition(realtime.position);
            setRealtime(realtime);
          }
          break;
        case 'authorized':
          {
            mutate('me');
          }
          break;
      }
    };
    window.addEventListener('message', handleMessage);

    postMessage({ type: 'status' });
  }, []);

  return (
    <Stack className="p-2 h-full text-left">
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
      <Section
        title="Realtime Status"
        tooltip="This tells you if the connection to Hogwarts Legacy is estaiblished and
        the player position could be synced with the map."
      >
        <p className={'text-sm flex items-center'}>
          <StatusIndicator
            issue={!realtime?.hlIsRunning || !realtime.position}
          />
          {realtime?.hlIsRunning
            ? 'Hogwarts Legacy is running'
            : 'Hogwarts Legacy is not running'}
        </p>

        <p className="text-sm text-gray-400">
          {realtime?.position
            ? `X: ${realtime?.position.x} Y: ${realtime?.position.y} Z: ${realtime?.position.z}`
            : 'Position is not detected'}
        </p>
      </Section>
      <Section
        title="Latest Savegame"
        tooltip="The latest savegame is required to sync your progress and discovered nodes on the map (in development)."
      >
        <SaveGame savegame={savegame} />
      </Section>
    </Stack>
  );
}

function StatusIndicator({ issue }: { issue: boolean }) {
  return (
    <span
      className={cn('inline-block w-3 h-3 mr-2 rounded-xl bg-green-500', {
        'bg-orange-500': issue,
      })}
    />
  );
}

function Section({
  title,
  tooltip,
  children,
}: {
  title: string;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-800 rounded p-1">
      <Tooltip label={<p className="text-sm">{tooltip}</p>}>
        <h4 className="text-md flex gap-1 items-center">
          {title} <IconHelp size={16} />
        </h4>
      </Tooltip>
      {children}
    </section>
  );
}

function SaveGame({ savegame }: { savegame: MESSAGE_STATUS['savegame'] }) {
  const [player, setPlayer] = useState<SavefilePlayer | null>(null);
  const [timeDistance, setTimeDistance] = useState('');

  useEffect(() => {
    if (!savegame) {
      return;
    }
    (async () => {
      try {
        const file = bodyToFile(savegame.body);
        const player = await readSavegame(file);
        setPlayer(player);
      } catch (error) {
        console.error(error);
      }
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
    <div className={'flex flex-col text-left w-full'}>
      <p className="flex items-center text-sm">
        <StatusIndicator issue={!savegame} /> {savegame?.name}{' '}
      </p>
      <div className="text-sm">
        {savegame && player ? (
          <>
            <p>
              <b>
                {player.firstName} {player.lastName}
              </b>{' '}
              | <b>{player.houseId}</b> | <b>{player.year}th</b> year
            </p>
            <p className="text-sm text-gray-400">
              <time dateTime={savegame.lastUpdate}>{timeDistance}</time>
            </p>
          </>
        ) : (
          <>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </>
        )}
      </div>
    </div>
  );
}
