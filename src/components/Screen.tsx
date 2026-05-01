import { type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import {
  SafeAreaView,
  type Edge,
} from "react-native-safe-area-context";

import { spacing } from "@/theme/spacing";

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
};

export const Screen = ({
  children,
  edges = ["top", "left", "right"],
  style,
}: ScreenProps) => {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
