import { create } from "zustand";

import { useRevealStore } from "@/store/reveal.store";

export type BiometryType = "face" | "fingerprint" | "iris" | "none";

type AuthSessionState = {
  isAuthenticated: boolean;
  biometryType: BiometryType;
  /**
   * When true, reveal flows skip device auth (after biometric sign-in, or after
   * the first successful reveal auth in the same session — e.g. test bypass).
   */
  revealSkipsDeviceAuth: boolean;
  signInWithBiometric: (type: BiometryType) => void;
  signInWithoutBiometricForTesting: () => void;
  /** Call after a successful reveal gate (biometric or skipped) for this session. */
  markRevealDeviceAuthSatisfiedForSession: () => void;
  signOut: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  isAuthenticated: false,
  biometryType: "none",
  revealSkipsDeviceAuth: false,
  signInWithBiometric: (type) =>
    set({
      isAuthenticated: true,
      biometryType: type,
      revealSkipsDeviceAuth: true,
    }),
  signInWithoutBiometricForTesting: () =>
    set({
      isAuthenticated: true,
      biometryType: "none",
      revealSkipsDeviceAuth: false,
    }),
  markRevealDeviceAuthSatisfiedForSession: () =>
    set({ revealSkipsDeviceAuth: true }),
  signOut: () => {
    useRevealStore.getState().hide();
    set({
      isAuthenticated: false,
      biometryType: "none",
      revealSkipsDeviceAuth: false,
    });
  },
}));
