import { create } from 'zustand';

type MapStore = {
  hogwartsLevel: number;
  setHogwartsLevel: (hogwartsLevel: number) => void;
  decreaseHogwartsLevel: () => void;
  increaseHogwartsLevel: () => void;
};
export const useMapStore = create<MapStore>((set) => ({
  hogwartsLevel: 0,
  setHogwartsLevel: (hogwartsLevel) => set(() => ({ hogwartsLevel })),
  decreaseHogwartsLevel: () =>
    set((state) => ({ hogwartsLevel: state.hogwartsLevel - 1 })),
  increaseHogwartsLevel: () =>
    set((state) => ({ hogwartsLevel: state.hogwartsLevel + 1 })),
}));
