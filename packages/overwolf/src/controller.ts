import { getGameIsRunning } from './lib/games';
import { waitForOverwolf } from './lib/overwolf';
import {
  closeMainWindow,
  closeWindow,
  getPreferedWindowName,
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
    const isGameRunning = await getGameIsRunning(HOGWARTS_LEGACY_CLASS_ID);
    if (isGameRunning) {
      const preferedWindowName = await getPreferedWindowName();
      restoreWindow(preferedWindowName);
    } else {
      restoreWindow(WINDOWS.DESKTOP);
    }
  };
  openApp();

  overwolf.extensions.onAppLaunchTriggered.addListener(openApp);

  overwolf.settings.hotkeys.onPressed.addListener(async (event) => {
    if (event.name === 'toggle_app') {
      const preferedWindowName = await getPreferedWindowName();
      toggleWindow(preferedWindowName);
    }
  });

  overwolf.games.onGameInfoUpdated.addListener(async (event) => {
    if (
      event.runningChanged &&
      event.gameInfo?.classId === HOGWARTS_LEGACY_CLASS_ID
    ) {
      const preferedWindowName = await getPreferedWindowName();
      if (event.gameInfo.isRunning) {
        if (preferedWindowName === WINDOWS.OVERLAY) {
          restoreWindow(WINDOWS.OVERLAY);
          closeWindow(WINDOWS.DESKTOP);
        } else {
          restoreWindow(WINDOWS.DESKTOP);
          closeWindow(WINDOWS.OVERLAY);
        }
      } else if (preferedWindowName === WINDOWS.OVERLAY) {
        closeMainWindow();
      }
    }
  });
}
