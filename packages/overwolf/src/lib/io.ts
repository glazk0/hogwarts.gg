export async function findSavegamesFolder() {
  const steamFolders = await listSavegames(
    `${overwolf.io.paths.localAppData}\\Hogwarts Legacy\\Saved\\SaveGames`,
  );
  const epicGamesFolders = await listSavegames(
    `${overwolf.io.paths.localAppData}\\HogwartsLegacy\\Saved\\SaveGames`,
  );
  const savegames = steamFolders || epicGamesFolders;
  if (!savegames) {
    return [];
  }

  return await Promise.all(
    savegames.slice(0, 1).map(async (savegame) => {
      const parts = savegame.split('\\');
      const body = await readFile(savegame);
      return {
        name: parts[parts.length - 1],
        path: savegame,
        body,
      };
    }),
  );
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

export async function readFile(filePath: string) {
  const content = await new Promise<string>((resolve, reject) => {
    overwolf.io.readFileContents(
      filePath,
      overwolf.io.enums.eEncoding.UTF8,
      (result) => {
        if (typeof result.content === 'undefined') {
          reject(result.error);
        } else {
          resolve(result.content);
        }
      },
    );
  });
  return content;
}
