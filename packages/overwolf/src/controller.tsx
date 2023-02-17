import { waitForOverwolf } from './lib/overwolf';
import {
  closeMainWindow,
  restoreWindow,
  toggleWindow,
  WINDOWS,
} from './lib/windows';

const HOGWARTS_LEGACY_CLASS_ID = 22600;

waitForOverwolf().then(() => {
  initController();
});

async function initController() {
  console.log('Init controller');
  const openApp = async () => {
    restoreWindow(WINDOWS.MAIN);
  };
  openApp();

  overwolf.extensions.onAppLaunchTriggered.addListener(openApp);

  overwolf.settings.hotkeys.onPressed.addListener(async (event) => {
    if (event.name === 'show_hide_app') {
      toggleWindow(WINDOWS.MAIN);
    }
  });

  overwolf.games.onGameInfoUpdated.addListener(async (event) => {
    if (
      event.runningChanged &&
      event.gameInfo?.classId === HOGWARTS_LEGACY_CLASS_ID
    ) {
      if (event.gameInfo.isRunning) {
        restoreWindow(WINDOWS.MAIN);
      } else {
        closeMainWindow();
      }
    }
  });
}
