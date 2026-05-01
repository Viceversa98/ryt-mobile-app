import { useMutation } from "@tanstack/react-query";

import type { IBiometricService } from "@/features/auth/services/BiometricService";
import {
  BIOMETRIC_USER_CANCELLED_MESSAGE,
  getPrimaryBiometryType,
} from "@/features/auth/services/expoBiometric.service";
import { BiometricUserCancelledError } from "@/lib/errors";
import { useAuthSessionStore } from "@/store/authSession.store";

type UseBiometricAuthParams = {
  biometricService: IBiometricService;
};

export const useBiometricAuth = ({
  biometricService,
}: UseBiometricAuthParams) => {
  const signInWithBiometric = useAuthSessionStore((s) => s.signInWithBiometric);

  return useMutation({
    mutationKey: ["auth", "biometric"],
    mutationFn: async () => {
      const caps = await biometricService.getCapabilities();
      if (!caps.available) {
        throw new Error(
          "Biometric authentication is not available on this device",
        );
      }

      const result = await biometricService.authenticate({
        promptMessage: "Sign in to Ryt",
        cancelLabel: "Cancel",
      });

      if (!result.success) {
        if (result.errorMessage === BIOMETRIC_USER_CANCELLED_MESSAGE) {
          throw new BiometricUserCancelledError();
        }
        throw new Error(result.errorMessage ?? "Authentication failed");
      }

      return getPrimaryBiometryType();
    },
    onSuccess: (biometryType) => {
      signInWithBiometric(biometryType);
    },
  });
};
