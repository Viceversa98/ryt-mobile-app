import { Redirect } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInLanding } from "@/features/auth/components/SignInLanding";
import { useBiometricAuth } from "@/features/auth/hooks/useBiometricAuth";
import { expoBiometricService } from "@/features/auth/services/expoBiometric.service";
import {
  BiometricUserCancelledError,
  mapUnknownToAppError,
} from "@/lib/errors";
import { ROUTES } from "@/navigation/routes";
import { useAuthSessionStore } from "@/store/authSession.store";

export default function LoginRoute() {
  const isAuthenticated = useAuthSessionStore((s) => s.isAuthenticated);
  const signInWithoutBiometricForTesting = useAuthSessionStore(
    (s) => s.signInWithoutBiometricForTesting,
  );
  const { mutate, isPending, error, reset } = useBiometricAuth({
    biometricService: expoBiometricService,
  });

  if (isAuthenticated) {
    return <Redirect href={ROUTES.DASHBOARD} />;
  }

  const handleAuthenticate = () => {
    reset();
    mutate();
  };

  const handleTestSignInWithoutBiometric = () => {
    reset();
    signInWithoutBiometricForTesting();
  };

  const errorMessage =
    error && !(error instanceof BiometricUserCancelledError)
      ? mapUnknownToAppError(error).message
      : null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <SignInLanding
            onContinue={handleAuthenticate}
            onTestSignInWithoutBiometric={
              __DEV__ ? handleTestSignInWithoutBiometric : undefined
            }
            loading={isPending}
            errorMessage={errorMessage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
