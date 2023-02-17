import { HOGWARTS_LEGACY_CLASS_ID } from './config';
import { listenToHotkeyBinding } from './hotkeys';
import { findSavegamesFolder } from './io';

export type MESSAGE_STATUS = {
  type: string;
  toggleAppHotkeyBinding: string;
  savegames: {
    name: string;
    path: string;
    body: string;
  }[];
};

export function communicate(iframe: HTMLIFrameElement) {
  const postMessage = iframe.contentWindow!.postMessage;

  const status: MESSAGE_STATUS = {
    type: 'status',
    toggleAppHotkeyBinding: '',
    savegames: [],
  };
  async function postStatus() {
    status.savegames = await findSavegamesFolder();
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
        break;
      case 'hotkey_binding':
        location.href = `overwolf://settings/games-overlay?hotkey=toggle_app&gameId=${HOGWARTS_LEGACY_CLASS_ID}`;
        break;
    }
  });
}
