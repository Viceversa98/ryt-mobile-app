import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

const FAB_SIZE = 56;

export const OverviewFabTabButton = ({
  onPress,
  onLongPress,
  accessibilityState,
  testID,
}: BottomTabBarButtonProps) => {
  const focused = accessibilityState?.selected ?? false;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={accessibilityState}
        accessibilityLabel="Overview"
        hitSlop={12}
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ borderless: true, radius: FAB_SIZE / 2 }}
        style={({ pressed }) => [
          styles.fab,
          focused ? styles.fabActive : styles.fabInactive,
          pressed && styles.fabPressed,
        ]}
      >
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={26}
          color={focused ? "#FFFFFF" : "#475569"}
        />
      </Pressable>
      <Text
        style={[
          styles.caption,
          { color: focused ? "#0019FF" : "#64748B" },
        ]}
        numberOfLines={1}
      >
        Overview
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    marginTop: -26,
    shadowColor: "#0B1020",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
  fabActive: {
    backgroundColor: "#0019FF",
  },
  fabInactive: {
    backgroundColor: "#E8EEFF",
    shadowOpacity: 0.12,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.92,
  },
  caption: {
    fontSize: 11,
    fontWeight: "600",
  },
});
