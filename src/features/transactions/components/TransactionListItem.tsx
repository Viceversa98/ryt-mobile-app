import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AmountText } from "@/features/transactions/components/AmountText";
import type { Transaction } from "@/features/transactions/schemas/transaction.schema";
import { useRevealStore } from "@/store/reveal.store";

const RYT_ICON = "#0019FF";
const CREDIT_ICON = "#059669";

type TransactionListItemProps = {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
  showBottomBorder?: boolean;
};

export const TransactionListItem = ({
  transaction,
  onPress,
  showBottomBorder = true,
}: TransactionListItemProps) => {
  const isAmountsRevealed = useRevealStore((s) => s.isAmountsRevealed);

  const dateLabel = new Date(transaction.date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const isCredit = transaction.type === "credit";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Transaction ${transaction.description}, ${dateLabel}`}
      accessibilityHint="Opens transaction details"
      onPress={() => onPress(transaction)}
      style={[
        styles.row,
        showBottomBorder && styles.rowBorder,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          isCredit ? styles.iconWrapCredit : styles.iconWrapDebit,
        ]}
      >
        <Ionicons
          name={isCredit ? "arrow-up" : "arrow-down"}
          size={20}
          color={isCredit ? CREDIT_ICON : RYT_ICON}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.subtitle}>{dateLabel}</Text>
      </View>
      <AmountText
        amount={transaction.amount}
        currency={transaction.currency}
        type={transaction.type}
        isRevealed={isAmountsRevealed}
        size="md"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F1F5F9",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapCredit: {
    backgroundColor: "#ECFDF5",
  },
  iconWrapDebit: {
    backgroundColor: "#EEF2FF",
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },
});
