import { useEffect, useRef } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
} from "react-native";

import type { TransactionType } from "@/features/transactions/schemas/transaction.schema";
import { formatCurrency } from "@/features/transactions/utils/formatCurrency";
import { maskAmount } from "@/features/transactions/utils/maskAmount";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental != null
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AmountTextBase = {
  amount: number;
  currency: string;
  isRevealed: boolean;
  size?: "md" | "lg" | "xl";
};

export type AmountTextProps =
  | (AmountTextBase & { type: TransactionType })
  | (AmountTextBase & { presentation: "balance" });

type TransactionAmountProps = AmountTextBase & { type: TransactionType };

const isBalancePresentation = (
  p: AmountTextProps,
): p is AmountTextBase & { presentation: "balance" } =>
  "presentation" in p && p.presentation === "balance";

const MINUS = "\u2212";

const sizeStyles = StyleSheet.create({
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
  xl: { fontSize: 36 },
});

export const AmountText = (props: AmountTextProps) => {
  const { amount, currency, isRevealed, size = "md" } = props;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isRevealed]);

  const sizeStyle =
    size === "lg" ? sizeStyles.lg : size === "xl" ? sizeStyles.xl : sizeStyles.md;

  let content: string;
  let textStyle: object[];
  let accessibilityLabel: string;

  if (!isRevealed) {
    content = maskAmount();
    textStyle = [styles.hidden, sizeStyle];
    accessibilityLabel = "Amount hidden";
  } else if (isBalancePresentation(props)) {
    const net = props.amount;
    const formatted =
      net < 0
        ? `${MINUS}${formatCurrency(Math.abs(net), currency)}`
        : formatCurrency(net, currency);
    content = formatted;
    textStyle = [styles.revealedInk, styles.tabular, sizeStyle];
    accessibilityLabel = formatted;
  } else {
    const { type } = props as TransactionAmountProps;
    const sign = type === "credit" ? "+" : MINUS;
    const formatted = `${sign}${formatCurrency(amount, currency)}`;
    content = formatted;
    accessibilityLabel = formatted;
    textStyle = [
      type === "credit" ? styles.revealedCredit : styles.revealedInk,
      styles.tabular,
      sizeStyle,
    ];
  }

  return (
    <Text style={[styles.weightSemibold, ...textStyle]} accessibilityLabel={accessibilityLabel}>
      {content}
    </Text>
  );
};

const styles = StyleSheet.create({
  weightSemibold: {
    fontWeight: "600",
  },
  hidden: {
    letterSpacing: 6,
    color: "#94A3B8",
  },
  revealedInk: {
    color: "#0B1020",
  },
  revealedCredit: {
    color: "#059669",
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
});
