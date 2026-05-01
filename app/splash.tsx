import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RytLoadingDots } from "@/components/RytLoadingDots";
import { ROUTES } from "@/navigation/routes";

const SPLASH_DURATION_MS = 1800;

export default function SplashRoute() {
  const router = useRouter();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      router.replace(ROUTES.ROOT);
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <RytLoadingDots animate />
        <Text style={styles.logo}>Ryt</Text>
        <Text style={styles.tagline}>Banking done right</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0019FF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
});
