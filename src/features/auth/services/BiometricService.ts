export type BiometricCapabilities = {
  available: boolean;
};

export type BiometricAuthenticateOptions = {
  promptMessage: string;
  cancelLabel?: string;
};

export type BiometricAuthenticateResult = {
  success: boolean;
  errorMessage?: string;
};

export type IBiometricService = {
  getCapabilities: () => Promise<BiometricCapabilities>;
  authenticate: (
    options: BiometricAuthenticateOptions,
  ) => Promise<BiometricAuthenticateResult>;
};
