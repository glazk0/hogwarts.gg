import { HOGWARTS_LEGACY_CLASS_ID } from './config';
import { listenToHotkeyBinding } from './hotkeys';
import { listenToSavegamesFolder } from './io';
import { setLastIFrameHref } from './storage';

export type MESSAGE_STATUS = {
  type: string;
  toggleAppHotkeyBinding: string;
  savegames: {
    name: string;
    path: string;
    body: string;
  }[];
};

const status: MESSAGE_STATUS = {
  type: 'status',
  toggleAppHotkeyBinding: '',
  savegames: [],
};

export function communicate(iframe: HTMLIFrameElement, callback: () => void) {
  const postMessage = iframe.contentWindow!.postMessage;

  async function postStatus() {
    listenToSavegamesFolder((savegames) => {
      status.savegames = savegames;
      postMessage(status, '*');
    });

    listenToHotkeyBinding('toggle_app', (binding) => {
      status.toggleAppHotkeyBinding = binding;
      postMessage(status, '*');
    });
  }

  let isListening = false;
  window.addEventListener('message', (message) => {
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
        if (!isListening) {
          postStatus();
          isListening = true;
        }
        callback();
        break;
      case 'hotkey_binding':
        location.href = `overwolf://settings/games-overlay?hotkey=toggle_app&gameId=${HOGWARTS_LEGACY_CLASS_ID}`;
        break;
      case 'href':
        if ('href' in data && typeof data.href === 'string') {
          setLastIFrameHref(data.href);
        }
        break;
    }
  });
}
