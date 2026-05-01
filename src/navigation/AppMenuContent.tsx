import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ROUTES } from "@/navigation/routes";
import { useAuthSessionStore } from "@/store/authSession.store";

type RouteItem = {
  id: string;
  title: string;
  subtitle: string;
  href: Href;
};

const NAV_LINKS: RouteItem[] = [
  {
    id: "overview",
    title: "Overview",
    subtitle: "Balances, shortcuts, and recent activity",
    href: ROUTES.DASHBOARD,
  },
  {
    id: "transactions",
    title: "Transactions",
    subtitle: "Full history of payments and deposits",
    href: ROUTES.TRANSACTIONS,
  },
  {
    id: "welcome",
    title: "Welcome",
    subtitle: "Short animation when you open the app",
    href: ROUTES.SPLASH,
  },
];

export const AppMenuContent = () => {
  const router = useRouter();
  const signOut = useAuthSessionStore((s) => s.signOut);

  const handleNavigate = useCallback(
    (href: Href) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(href);
    },
    [router],
  );

  const handleSignOut = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signOut();
    router.replace(ROUTES.LOGIN);
  }, [router, signOut]);

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>Quick links</Text>

      <View style={styles.card}>
        {NAV_LINKS.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            accessibilityHint={item.subtitle}
            style={({ pressed }) => [
              styles.row,
              index < NAV_LINKS.length - 1 && styles.rowWithBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => handleNavigate(item.href)}
          >
            <View style={styles.rowMain}>
              <Text style={styles.rowLabel}>{item.title}</Text>
              <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#CBD5E1"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </Pressable>
        ))}
      </View>

      <View style={styles.spacerBeforeSignOut} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        accessibilityHint="Ends your session and returns to sign in"
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.signOutPressed,
        ]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    paddingBottom: 28,
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 14,
    gap: 12,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  rowPressed: {
    backgroundColor: "#F8FAFC",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  rowSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
    paddingRight: 4,
  },
  spacerBeforeSignOut: {
    height: 28,
  },
  signOutButton: {
    marginHorizontal: 2,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  signOutPressed: {
    backgroundColor: "#FEF2F2",
  },
  signOutLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    textAlign: "center",
  },
});
