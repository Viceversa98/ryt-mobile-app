import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const ROWS = 5;

export const TransactionListSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.card}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Animated.View style={[styles.avatar, { opacity }]} />
          <View style={styles.lines}>
            <Animated.View style={[styles.lineShort, { opacity }]} />
            <Animated.View style={[styles.lineTiny, { opacity }]} />
          </View>
          <Animated.View style={[styles.amount, { opacity }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  lines: {
    flex: 1,
    gap: 8,
  },
  lineShort: {
    height: 14,
    width: "55%",
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },
  lineTiny: {
    height: 10,
    width: "35%",
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  amount: {
    width: 72,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },
});
