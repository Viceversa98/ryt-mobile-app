import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { RytLoadingDots } from "@/components/RytLoadingDots";

type SignInLandingProps = {
  onContinue: () => void;
  /** Dev / QA: enters the app without login biometrics; reveal flows still prompt. */
  onTestSignInWithoutBiometric?: () => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const SignInLanding = ({
  onContinue,
  onTestSignInWithoutBiometric,
  loading = false,
  errorMessage,
}: SignInLandingProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <RytLoadingDots
          animate={false}
          dotSize={8}
          gap={8}
          wrapperStyle={{ marginBottom: 12 }}
        />
        <Text style={styles.logo}>Ryt</Text>
        <Text style={styles.tagline}>Secure banking</Text>
      </View>

      <Text style={styles.title}>Sign in to your account</Text>
      <Text style={styles.body}>
        Use Face ID, fingerprint, or your device PIN where available. Your
        biometrics never leave this device.
      </Text>

      <View style={styles.dividerBlock}>
        <Text style={styles.dividerLabel}>Security</Text>
        <Text style={styles.dividerTitle}>Biometric gate</Text>
      </View>
      <View style={styles.dividerBlock}>
        <Text style={styles.dividerLabel}>Session</Text>
        <Text style={styles.dividerTitle}>Private & encrypted</Text>
      </View>

      {errorMessage ? (
        <Text style={styles.error} accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}

      <View style={styles.cta}>
        <Button
          label="Sign in"
          variant="brand"
          shape="rounded-xl"
          onPress={onContinue}
          loading={loading}
          accessibilityHint="Starts secure biometric sign-in"
        />
      </View>

      {onTestSignInWithoutBiometric ? (
        <View style={styles.testBypass}>
          <Button
            label="Continue without biometric (testing)"
            variant="ghost"
            shape="rounded-xl"
            disabled={loading}
            onPress={onTestSignInWithoutBiometric}
            accessibilityHint="Opens the app without device biometrics at sign-in only; showing amounts still requires biometrics"
          />
          <Text style={styles.testBypassHint}>
            For QA: sign-in skips device auth; the first reveal still asks for
            Face ID, fingerprint, or PIN — then behaves like a normal session.
          </Text>
        </View>
      ) : null}

      <View style={styles.footerRule}>
        <View style={styles.rule} />
        <Text style={styles.ruleText}>Or continue with</Text>
        <View style={styles.rule} />
      </View>
      <Text style={styles.footerHint}>
        Face ID · Touch ID · Device PIN
      </Text>

      <View style={styles.footerSpacer} />
      <Text style={styles.footerLegal}>Ryt Bank · Demo experience</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: "700",
    color: "#0019FF",
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
  },
  body: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
  },
  dividerBlock: {
    marginTop: 24,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#94A3B8",
  },
  dividerTitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#1E293B",
  },
  error: {
    marginTop: 24,
    fontSize: 14,
    color: "#DC2626",
  },
  cta: {
    marginTop: 24,
    width: "100%",
  },
  testBypass: {
    marginTop: 16,
    width: "100%",
    gap: 8,
  },
  testBypassHint: {
    fontSize: 12,
    lineHeight: 17,
    color: "#94A3B8",
    textAlign: "center",
  },
  footerRule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E2E8F0",
  },
  ruleText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  footerHint: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
  },
  footerSpacer: {
    flex: 1,
    minHeight: 32,
  },
  footerLegal: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    paddingBottom: 8,
  },
});
