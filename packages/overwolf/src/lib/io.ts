import type { MESSAGE_STATUS } from './messages';

let cachedFiles: string[] = [];
const savegames: MESSAGE_STATUS['savegames'] = [];
export async function listenToSavegamesFolder(
  callback: (savegames: MESSAGE_STATUS['savegames']) => void,
) {
  const [steamFolders, epicGamesFolders] = await Promise.all([
    listSavegames(
      `${overwolf.io.paths.localAppData}\\Hogwarts Legacy\\Saved\\SaveGames`,
    ),
    listSavegames(
      `${overwolf.io.paths.localAppData}\\HogwartsLegacy\\Saved\\SaveGames`,
    ),
  ]);

  const files = steamFolders || epicGamesFolders || [];
  if (cachedFiles.length !== files.length) {
    let changed = false;
    for (const file of files) {
      const parts = file.split('\\');
      const name = parts[parts.length - 1];

      if (savegames.some((savegame) => savegame.name === name)) {
        continue;
      }
      changed = true;
      const body = await readFile(file);

      const savegame = {
        name,
        path: file,
        body,
      };
      if (cachedFiles.length === 0) {
        savegames.push(savegame);
      } else {
        savegames.unshift(savegame);
      }
      listenToFile(file, (body) => {
        const savegame = savegames.find((savegame) => savegame.name === name)!;
        savegame.body = body;
        callback(savegames);
      });
    }

    if (changed) {
      cachedFiles = files;
      callback(savegames);
    }
  }

  setTimeout(() => {
    listenToSavegamesFolder(callback);
  }, 5000);
}

export async function listSavegames(folderPath: string) {
  return await new Promise<false | string[]>((resolve) => {
    overwolf.io.dir(folderPath, async (result) => {
      if (result.error || !result.data) {
        return resolve(false);
      }
      if (!result.data || result.data.length === 0) {
        return resolve(false);
      }
      if (result.data[0].type !== 'dir') {
        return resolve(false);
      }
      const folder = result.data[0];
      overwolf.io.dir(`${folderPath}\\${folder.name}`, async (result) => {
        if (!result.data) {
          return resolve([]);
        }
        const files = result.data.filter(
          (fileOrDir) =>
            fileOrDir.type === 'file' &&
            fileOrDir.name.startsWith('HL') &&
            fileOrDir.name.endsWith('.sav'),
        );
        resolve(
          files.map((file) => `${folderPath}\\${folder.name}\\${file.name}`),
        );
      });
    });
  });
}

async function readFile(filePath: string) {
  const body = await new Promise<string>((resolve, reject) => {
    overwolf.io.readBinaryFile(
      filePath,
      {
        encoding: overwolf.io.enums.eEncoding.UTF8,
        maxBytesToRead: 0,
        offset: 0,
      },
      (result) => {
        if (typeof result.content === 'undefined') {
          reject(result.error);
        } else {
          resolve(result.content);
        }
      },
    );
  });
  return body;
}

function listenToFile(filePath: string, callback: (body: string) => void) {
  let firstRun = true;
  // @ts-ignore https://github.com/overwolf/types/pull/66
  overwolf.io.watchFile(filePath, async () => {
    if (firstRun) {
      firstRun = false;
      return;
    }
    const body = await readFile(filePath);
    callback(body);
  });
}
