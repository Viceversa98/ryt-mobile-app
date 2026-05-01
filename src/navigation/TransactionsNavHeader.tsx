import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ROUTES } from "@/navigation/routes";

export const TransactionsHeaderBack = () => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.DASHBOARD);
  }, [router]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      accessibilityHint="Returns to the previous screen or overview"
      hitSlop={12}
      onPress={handlePress}
      style={styles.iconHit}
    >
      <Ionicons name="chevron-back" size={26} color="#0B1020" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconHit: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
