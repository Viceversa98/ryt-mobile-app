import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import type { IBiometricService } from "@/features/auth/services/BiometricService";
import { BIOMETRIC_USER_CANCELLED_MESSAGE } from "@/features/auth/services/expoBiometric.service";
import { BiometricUserCancelledError } from "@/lib/errors";
import { useAuthSessionStore } from "@/store/authSession.store";
import { useRevealStore } from "@/store/reveal.store";

type UseRevealAmountsParams = {
  biometricService: IBiometricService;
};

export const useRevealAmounts = ({
  biometricService,
}: UseRevealAmountsParams) => {
  const reveal = useRevealStore((s) => s.reveal);
  const hide = useRevealStore((s) => s.hide);

  const mutation = useMutation({
    mutationKey: ["auth", "reveal-amounts"],
    mutationFn: async () => {
      const { revealSkipsDeviceAuth } = useAuthSessionStore.getState();
      // Already satisfied for this session (biometric sign-in or prior reveal).
      if (revealSkipsDeviceAuth) {
        return { success: true as const };
      }

      const caps = await biometricService.getCapabilities();
      if (!caps.available) {
        throw new Error(
          "Biometric authentication is not available on this device",
        );
      }

      const result = await biometricService.authenticate({
        promptMessage: "Reveal transaction amounts",
        cancelLabel: "Cancel",
      });

      if (!result.success) {
        if (result.errorMessage === BIOMETRIC_USER_CANCELLED_MESSAGE) {
          throw new BiometricUserCancelledError();
        }
        throw new Error(result.errorMessage ?? "Authentication failed");
      }

      return result;
    },
    onSuccess: () => {
      useAuthSessionStore.getState().markRevealDeviceAuthSatisfiedForSession();
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reveal();
    },
    onError: (err) => {
      if (err instanceof BiometricUserCancelledError) {
        return;
      }
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  return {
    ...mutation,
    hideAmounts: hide,
  };
};
