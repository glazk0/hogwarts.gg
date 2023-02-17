import { extractDatabase, extractPlayer } from '#/lib/savefiles';
import type { MESSAGE_STATUS } from '#/packages/overwolf/src/lib/messages';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import Stack from '../Stack';

export default function Status() {
  const [status, setStatus] = useState<MESSAGE_STATUS | null>(null);

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
        setStatus(data as MESSAGE_STATUS);
      }
    };
    window.addEventListener('message', handleMessage);

    postMessage({ type: 'status' });
  }, []);

  return (
    <Stack className="p-2">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
      <p>
        Show/Hide app:{' '}
        <span
          className="font-mono bg-gray-900 hover:bg-gray-800 border rounded p-1 cursor-pointer"
          onClick={() => postMessage({ type: 'hotkey_binding' })}
        >
          {status?.toggleAppHotkeyBinding}
        </span>
      </p>
      <h4>Savegames</h4>
      <ul>
        {status?.savegames.map((savegame) => (
          <li key={savegame.name}>
            <SaveGame savegame={savegame} />
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
}: {
  savegame: MESSAGE_STATUS['savegames'][number];
}) {
  useEffect(() => {
    (async () => {
      const initSqlJs = window.initSqlJs;
      const blob = new Blob([savegame.body], { type: 'text/plain' });
      const file = new File([blob], 'savegame.sav', { type: 'text/plain' });

      const rawdb = await extractDatabase(await file.arrayBuffer());
      const SQL = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      const db = await new SQL.Database(rawdb);

      const player = extractPlayer(db);
      console.log(player);
    })();
  }, [savegame]);
  return <div>{savegame.name}</div>;
}
