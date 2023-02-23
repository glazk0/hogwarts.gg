export function getGameIsRunning(gameId: number): Promise<boolean> {
  return new Promise((resolve) => {
    overwolf.games.getRunningGameInfo((result) => {
      resolve(result && result.classId === gameId);
    });
  });
}

export function listenToGameInfo(
  callback: (gameInfo: overwolf.games.RunningGameInfo | undefined) => void,
) {
  overwolf.games.onGameInfoUpdated.addListener((event) => {
    if (event.gameChanged) {
      callback(event.gameInfo);
    }
  });

  overwolf.games.getRunningGameInfo((result) => {
    callback(result);
  });
}
