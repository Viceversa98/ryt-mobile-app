import { create } from "zustand";

type RevealState = {
  isAmountsRevealed: boolean;
  reveal: () => void;
  hide: () => void;
  reset: () => void;
};

export const useRevealStore = create<RevealState>((set) => ({
  isAmountsRevealed: false,
  reveal: () => set({ isAmountsRevealed: true }),
  hide: () => set({ isAmountsRevealed: false }),
  reset: () => set({ isAmountsRevealed: false }),
}));
