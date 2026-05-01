import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const RYT_BRAND_DOT_COLORS = [
  "#FBBF24",
  "#38BDF8",
  "#4ADE80",
  "#FB923C",
] as const;

const DOT_COUNT = RYT_BRAND_DOT_COLORS.length;
const WAVE_LIFT = 10;
const BOB_DURATION_MS = 320;
const STAGGER_MS = 85;

type RytLoadingDotsProps = {
  animate?: boolean;
  colors?: readonly string[];
  dotSize?: number;
  gap?: number;
  wrapperStyle?: object;
};

export const RytLoadingDots = ({
  animate = true,
  colors = RYT_BRAND_DOT_COLORS,
  dotSize = 10,
  gap = 8,
  wrapperStyle,
}: RytLoadingDotsProps) => {
  const anims = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
  ).current;

  const palette = colors.slice(0, DOT_COUNT);

  useEffect(() => {
    if (!animate) {
      anims.forEach((a) => {
        a.stopAnimation();
        a.setValue(0);
      });
      return undefined;
    }

    const cycles = anims.map((value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: BOB_DURATION_MS,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: BOB_DURATION_MS,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    const wave = Animated.stagger(STAGGER_MS, cycles);
    wave.start();

    return () => {
      wave.stop();
      anims.forEach((a) => a.setValue(0));
    };
  }, [animate, anims]);

  return (
    <View
      style={[styles.row, { gap, marginBottom: 16 }, wrapperStyle]}
      accessibilityLabel={animate ? "Loading" : undefined}
      accessibilityRole={animate ? "progressbar" : undefined}
    >
      {palette.map((color, index) => {
        const translateY = anims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -WAVE_LIFT],
        });

        return (
          <Animated.View
            key={`ryt-dot-${index}`}
            style={[
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: color,
              },
              { transform: [{ translateY }] },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
