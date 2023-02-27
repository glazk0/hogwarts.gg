import useLanguage from '#/lib/hooks/use-language';
import { useSetPlayerPosition } from '#/lib/hooks/use-player-position';
import {
  useSavegamePlayer,
  useSetSavegamePlayer,
} from '#/lib/hooks/use-savegame-player';
import { getDateLocale } from '#/lib/i18n/settings';
import type { Translations } from '#/lib/i18n/types';
import { postMessage } from '#/lib/messages';
import { bodyToFile, readSavegame } from '#/lib/savefiles';
import { cn } from '#/lib/utils';
import { IconHelp } from '@tabler/icons-react';
import { formatDistance } from 'date-fns';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
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

export default function Status({
  translations,
}: {
  translations: Translations;
}) {
  const [status, setStatus] = useState<MESSAGE_STATUS | null>(null);
  const [realtime, setRealtime] = useState<MESSAGE_REALTIME | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
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
            if (realtime.position?.x) {
              setPlayerPosition(realtime.position);
            }
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
      <p className="text-orange-500 text-sm">{translations.inDevelopment}</p>
      <div>
        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={status?.overlay ?? true}
            onChange={() => postMessage({ type: 'overlay' })}
          />
          <span>{translations.activateOverlay}</span>
        </label>
        <p className="text-xs text-gray-500">
          {translations.activateOverlayDescription}
        </p>
      </div>
      <p className="text-sm">
        {translations.showHideApp}
        <button
          className="ml-2 font-mono bg-gray-900 hover:bg-gray-800 border rounded py-0.5 px-1  w-fit"
          onClick={() => postMessage({ type: 'hotkey_binding' })}
        >
          {status?.toggleAppHotkeyBinding ?? translations.unknown}
        </button>
      </p>
      <Section
        title={translations.realtimeStatus}
        tooltip={translations.realtimeStatusToopltip}
      >
        <p className={'text-sm flex items-center'}>
          <StatusIndicator
            issue={!realtime?.hlIsRunning || !realtime.position}
          />
          {realtime?.hlIsRunning
            ? translations.hogwartsLegacyIsRunning
            : translations.hogwartsLegacyIsNotRunning}
        </p>

        <p className="text-sm text-gray-400">
          {realtime?.position
            ? `X: ${realtime?.position.x} Y: ${realtime?.position.y} Z: ${realtime?.position.z}`
            : translations.positionIsNotDetected}
        </p>
      </Section>
      <Section
        title={translations.latestSavegame}
        tooltip={translations.latestSavegameDescription}
      >
        <SaveGame savegame={savegame} translations={translations} />
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

function SaveGame({
  savegame,
  translations,
}: {
  savegame: MESSAGE_STATUS['savegame'];
  translations: Translations;
}) {
  const [timeDistance, setTimeDistance] = useState('');
  const language = useLanguage();
  const setSavegamePlayer = useSetSavegamePlayer();
  const { data: player } = useSavegamePlayer();

  useEffect(() => {
    if (!savegame) {
      return;
    }
    (async () => {
      try {
        const file = bodyToFile(savegame.body);
        const player = await readSavegame(file);
        setSavegamePlayer(player);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [savegame]);

  useEffect(() => {
    if (!savegame) {
      return;
    }

    const intervalId = setInterval(async () => {
      const locale = await getDateLocale(language);
      setTimeDistance(
        formatDistance(new Date(savegame.lastUpdate), new Date(), {
          addSuffix: true,
          includeSeconds: true,
          locale: locale,
        }),
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [savegame, language]);

  return (
    <div className={'flex flex-col text-left w-full'}>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
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
              | <b>{player.houseId}</b> | {translations.year}{' '}
              <b>{player.year}</b>
            </p>
            <p className="text-sm text-gray-400">
              <time dateTime={savegame.lastUpdate}>{timeDistance}</time>
            </p>
            <h5 className="font-semibold">{translations.hogwarts}</h5>
            <p>
              {translations.chests}:{' '}
              {player.locations.hogwarts.chests.values.length}/
              {player.locations.hogwarts.chests.max}
            </p>
            <p>
              {translations.collections}:{' '}
              {player.locations.hogwarts.collections.values.length}/
              {player.locations.hogwarts.collections.max}
            </p>
            <p>
              {translations.fastTravel}:{' '}
              {player.locations.hogwarts.fastTravels.values.length}/
              {player.locations.hogwarts.fastTravels.max}
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
