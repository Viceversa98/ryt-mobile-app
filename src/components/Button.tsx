import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "brand";
  shape?: "pill" | "rounded-xl";
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
} & Pick<PressableProps, "accessibilityLabel">;

export const Button = ({
  label,
  onPress,
  variant = "primary",
  shape,
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  labelStyle,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const innerBorderRadius = (() => {
    if (shape === "rounded-xl") {
      return 16;
    }
    if (shape === "pill") {
      return 9999;
    }
    if (variant === "brand") {
      return 9999;
    }
    return 10;
  })();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.pressableRoot, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            { borderRadius: innerBorderRadius },
            variant === "primary" && styles.primary,
            variant === "secondary" && styles.secondary,
            variant === "ghost" && styles.ghostInner,
            variant === "brand" && styles.brand,
            pressed &&
              !isDisabled &&
              variant === "brand" &&
              styles.brandPressed,
            pressed &&
              !isDisabled &&
              variant !== "ghost" &&
              variant !== "brand" &&
              styles.pressedOverlay,
            isDisabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator
              key="button-loading-indicator"
              color={
                variant === "primary" || variant === "brand"
                  ? "#FFFFFF"
                  : "#2563EB"
              }
            />
          ) : (
            <Text
              key="button-label"
              style={[
                styles.label,
                variant === "primary" && styles.labelPrimary,
                variant === "secondary" && styles.labelSecondary,
                variant === "ghost" && styles.labelGhost,
                variant === "brand" && styles.labelBrand,
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableRoot: {
    alignSelf: "stretch",
  },
  inner: {
    minHeight: 48,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 0,
  },
  primary: {
    backgroundColor: "#2563EB",
    elevation: 2,
  },
  secondary: {
    backgroundColor: "#E5E7EB",
    borderWidth: 0,
  },
  ghostInner: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  brand: {
    backgroundColor: "#0019FF",
    elevation: 3,
  },
  brandPressed: {
    backgroundColor: "#0014CC",
  },
  pressedOverlay: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelPrimary: {
    color: "#FFFFFF",
  },
  labelSecondary: {
    color: "#111827",
  },
  labelGhost: {
    color: "#2563EB",
  },
  labelBrand: {
    color: "#FFFFFF",
  },
});
