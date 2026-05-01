import { StyleSheet, Text, View } from "react-native";

import { AmountText } from "@/features/transactions/components/AmountText";
import type { Transaction } from "@/features/transactions/schemas/transaction.schema";
import { useRevealStore } from "@/store/reveal.store";

type TransactionDetailCardProps = {
  transaction: Transaction;
};

export const TransactionDetailCard = ({
  transaction,
}: TransactionDetailCardProps) => {
  const isAmountsRevealed = useRevealStore((s) => s.isAmountsRevealed);

  const dateLabel = new Date(transaction.date).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={[styles.label, styles.labelFirst]}>Description</Text>
      <Text style={styles.value}>{transaction.description}</Text>

      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountRow}>
        <AmountText
          amount={transaction.amount}
          currency={transaction.currency}
          type={transaction.type}
          isRevealed={isAmountsRevealed}
          size="lg"
        />
      </View>

      <Text style={styles.label}>Type</Text>
      <Text style={styles.value}>
        {transaction.type === "credit" ? "Credit" : "Debit"}
      </Text>

      <Text style={styles.label}>Date</Text>
      <Text style={styles.value}>{dateLabel}</Text>

      <Text style={styles.label}>Currency</Text>
      <Text style={styles.value}>{transaction.currency}</Text>

      <Text style={styles.label}>Reference</Text>
      <Text style={styles.value}>{transaction.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 24,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748B",
    marginTop: 14,
  },
  labelFirst: {
    marginTop: 0,
  },
  value: {
    fontSize: 16,
    color: "#0B1020",
    marginTop: 4,
  },
  amountRow: {
    marginTop: 4,
  },
});
