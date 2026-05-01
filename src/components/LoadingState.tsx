import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingStateProps = {
  message: string;
};

export const LoadingState = ({ message }: LoadingStateProps) => {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color="#0019FF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  text: {
    fontSize: 15,
    color: "#64748B",
  },
});
