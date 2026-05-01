import * as LocalAuthentication from "expo-local-authentication";

import type {
  BiometricAuthenticateOptions,
  BiometricCapabilities,
  BiometricAuthenticateResult,
  IBiometricService,
} from "@/features/auth/services/BiometricService";
import type { BiometryType } from "@/store/authSession.store";

export const BIOMETRIC_USER_CANCELLED_MESSAGE = "Authentication was cancelled";

const toResult = (
  success: boolean,
  errorMessage?: string,
): BiometricAuthenticateResult => ({ success, errorMessage });

const resolvePrimaryBiometryType = async (): Promise<BiometryType> => {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (
    types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
  ) {
    return "face";
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return "fingerprint";
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return "iris";
  }
  return "none";
};

export const expoBiometricService: IBiometricService = {
  async getCapabilities(): Promise<BiometricCapabilities> {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const hardware = await LocalAuthentication.hasHardwareAsync();
    return { available: hardware && enrolled };
  },

  async authenticate(
    options: BiometricAuthenticateOptions,
  ): Promise<BiometricAuthenticateResult> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage,
      cancelLabel: options.cancelLabel ?? "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return toResult(true);
    }

    if (result.error === "user_cancel") {
      return toResult(false, BIOMETRIC_USER_CANCELLED_MESSAGE);
    }

    return toResult(
      false,
      result.warning ?? result.error ?? "Authentication failed",
    );
  },
};

export const getPrimaryBiometryType = resolvePrimaryBiometryType;
