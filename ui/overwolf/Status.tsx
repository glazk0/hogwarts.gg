import type { MESSAGE_STATUS } from '#/packages/overwolf/src/lib/messages';
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
      <p>
        Show/Hide app:{' '}
        <span
          className="font-mono bg-gray-900 hover:bg-gray-800 border rounded p-1 cursor-pointer"
          onClick={() => postMessage({ type: 'hotkey_binding' })}
        >
          {status?.toggleAppHotkeyBinding}
        </span>
      </p>
    </Stack>
  );
}

function postMessage(message: { type: string; [key: string]: any }) {
  window.top!.postMessage(message, '*');
}
