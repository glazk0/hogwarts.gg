export function loadPlugin<T = unknown>(name: string) {
  return new Promise<T>((resolve, reject) =>
    overwolf.extensions.current.getExtraObject(name, (data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.object!);
      }
    }),
  );
}

type MFVector = {
  X: number;
  Y: number;
  Z: number;
};
type MFRotator = {
  Pitch: number;
  Yaw: number;
  Roll: number;
};
export type HLHook = {
  InitializeOverwolf: (callback: (error: boolean) => void) => void;
  GetPlayerPositionAndRotationOverwolf: (
    callback: (pos: MFVector, rot: MFRotator) => void,
  ) => void;
};

export function loadHLHookPlugin() {
  return loadPlugin<HLHook>('hlhook');
}
