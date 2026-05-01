import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Screen } from "@/components/Screen";
import { useRevealAmounts } from "@/features/auth/hooks/useRevealAmounts";
import { expoBiometricService } from "@/features/auth/services/expoBiometric.service";
import { AmountText } from "@/features/transactions/components/AmountText";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";
import { TransactionListSkeleton } from "@/features/transactions/components/TransactionListSkeleton";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import type { Transaction } from "@/features/transactions/schemas/transaction.schema";
import {
  computeNetBalance,
  primaryCurrency,
} from "@/features/transactions/utils/computeNetBalance";
import { mapUnknownToAppError } from "@/lib/errors";
import { ROUTES } from "@/navigation/routes";
import { useRevealStore } from "@/store/reveal.store";

const RECENT_LIMIT = 5;

export const DashboardScreen = () => {
  const router = useRouter();
  const isAmountsRevealed = useRevealStore((s) => s.isAmountsRevealed);
  const hideAmounts = useRevealStore((s) => s.hide);
  const {
    mutate: revealMutate,
    isPending: isRevealPending,
    reset: resetRevealMutation,
  } = useRevealAmounts({ biometricService: expoBiometricService });

  const { data, isPending, isError, error, refetch } = useTransactions();

  const currency = useMemo(
    () => (data?.length ? primaryCurrency(data) : "USD"),
    [data],
  );

  const netBalance = useMemo(
    () => (data?.length ? computeNetBalance(data) : 0),
    [data],
  );

  const recent = useMemo(() => {
    if (!data?.length) {
      return [];
    }
    return [...data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, RECENT_LIMIT);
  }, [data]);

  const handleViewTransactions = useCallback(() => {
    router.push(ROUTES.TRANSACTIONS);
  }, [router]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push(ROUTES.transactionDetail(transaction.id));
    },
    [router],
  );

  const handleBalanceVisibilityPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isAmountsRevealed) {
      hideAmounts();
      return;
    }
    resetRevealMutation();
    revealMutate();
  }, [
    hideAmounts,
    isAmountsRevealed,
    revealMutate,
    resetRevealMutation,
  ]);

  if (isPending && !data) {
    return (
      <Screen edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <TransactionListSkeleton />
        </View>
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen edges={["left", "right", "bottom"]}>
        <ErrorState
          message={mapUnknownToAppError(error).message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen edges={["left", "right", "bottom"]}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptyBody}>
            When transactions appear, you will see your balance and history here.
          </Text>
          <Button
            label="View transactions"
            variant="brand"
            onPress={handleViewTransactions}
            accessibilityHint="Opens the full transaction list"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Total balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceAmount}>
              <AmountText
                presentation="balance"
                amount={netBalance}
                currency={currency}
                isRevealed={isAmountsRevealed}
                size="xl"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isAmountsRevealed ? "Hide balance" : "Show balance"
              }
              hitSlop={10}
              disabled={isRevealPending}
              onPress={handleBalanceVisibilityPress}
              style={styles.eyeBtn}
            >
              {isRevealPending ? (
                <ActivityIndicator size="small" color="#0019FF" />
              ) : (
                <Ionicons
                  name={isAmountsRevealed ? "eye-off-outline" : "eye-outline"}
                  size={26}
                  color={isAmountsRevealed ? "#64748B" : "#0019FF"}
                />
              )}
            </Pressable>
          </View>
          <Text style={styles.cardHint}>
            Demo summary from your mock activity. Credits increase this figure;
            debits reduce it.
          </Text>
        </View>

        <View style={styles.cta}>
          <Button
            label="View transactions"
            variant="brand"
            shape="rounded-xl"
            onPress={handleViewTransactions}
            accessibilityHint="Opens your full transaction history"
          />
        </View>

        <Text style={styles.sectionLabel}>Recent activity</Text>

        <View style={styles.listCard}>
          {recent.map((transaction, index) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              onPress={handleTransactionPress}
              showBottomBorder={index < recent.length - 1}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all transactions"
          onPress={handleViewTransactions}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>See all transactions</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
  scroll: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  balanceCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 24,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748B",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    minHeight: 52,
  },
  balanceAmount: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  eyeBtn: {
    padding: 8,
    borderRadius: 999,
  },
  cardHint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },
  cta: {
    marginTop: 24,
  },
  sectionLabel: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748B",
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  linkBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0019FF",
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
