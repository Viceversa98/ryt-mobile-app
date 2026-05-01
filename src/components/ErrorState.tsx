import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button label="Try again" variant="primary" onPress={onRetry} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  message: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
  },
});
