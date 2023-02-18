import { HOGWARTS_LEGACY_CLASS_ID } from './config';
import { listenToHotkeyBinding } from './hotkeys';
import { listenToSavegamesFolder } from './io';
import { setLastIFrameHref } from './storage';
import {
  getPreferedWindowName,
  togglePreferedWindow,
  WINDOWS,
} from './windows';

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

const status: MESSAGE_STATUS = {
  type: 'status',
  toggleAppHotkeyBinding: '',
  savegame: null,
  overlay: true,
};

export function communicate(iframe: HTMLIFrameElement, callback: () => void) {
  const postMessage = iframe.contentWindow!.postMessage;

  async function refreshPreferedWindowName() {
    const preferedWindowName = await getPreferedWindowName();
    status.overlay = preferedWindowName === WINDOWS.OVERLAY;
    postMessage(status, '*');
  }

  let isListening = false;
  async function postStatus() {
    if (isListening) {
      return;
    }
    isListening = true;

    await refreshPreferedWindowName();

    listenToSavegamesFolder((savegame) => {
      console.log('savegame', savegame);

      status.savegame = savegame;
      postMessage(status, '*');
    });

    listenToHotkeyBinding('toggle_app', (binding) => {
      status.toggleAppHotkeyBinding = binding;
      postMessage(status, '*');
    });
  }

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
        postStatus();
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
      case 'overlay':
        togglePreferedWindow().then(() => {
          refreshPreferedWindowName();
        });
        break;
    }
  });
}
