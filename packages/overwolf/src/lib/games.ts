export function getGameIsRunning(gameId: number): Promise<boolean> {
  return new Promise((resolve) => {
    overwolf.games.getRunningGameInfo((result) => {
      resolve(result && result.classId === gameId);
    });
  });
}
