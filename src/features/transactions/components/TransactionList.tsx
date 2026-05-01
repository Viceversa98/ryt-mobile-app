import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Screen } from "@/components/Screen";
import { useRevealAmounts } from "@/features/auth/hooks/useRevealAmounts";
import { expoBiometricService } from "@/features/auth/services/expoBiometric.service";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";
import { TransactionListSkeleton } from "@/features/transactions/components/TransactionListSkeleton";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import type { Transaction } from "@/features/transactions/schemas/transaction.schema";
import { mapUnknownToAppError } from "@/lib/errors";
import { ROUTES } from "@/navigation/routes";
import { useRevealStore } from "@/store/reveal.store";
import { spacing } from "@/theme/spacing";

export const TransactionList = () => {
  const router = useRouter();
  const isAmountsRevealed = useRevealStore((s) => s.isAmountsRevealed);
  const hideAmounts = useRevealStore((s) => s.hide);
  const {
    mutate: revealMutate,
    isPending: isRevealPending,
    reset: resetRevealMutation,
  } = useRevealAmounts({ biometricService: expoBiometricService });

  const { data, isPending, isError, error, refetch, isRefetching } =
    useTransactions();

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push(ROUTES.transactionDetail(transaction.id));
    },
    [router],
  );

  const handleRevealPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetRevealMutation();
    revealMutate();
  }, [revealMutate, resetRevealMutation]);

  const handleHidePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    hideAmounts();
  }, [hideAmounts]);

  const revealToolbar = (
    <View style={styles.toolbar}>
      {isAmountsRevealed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hide transaction amounts"
          hitSlop={10}
          onPress={handleHidePress}
          style={styles.toolbarBtn}
        >
          <Text style={styles.toolbarTextMuted}>Hide amounts</Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reveal transaction amounts"
          disabled={isRevealPending}
          hitSlop={10}
          onPress={handleRevealPress}
          style={styles.toolbarBtn}
        >
          <Text
            style={
              isRevealPending ? styles.toolbarTextDisabled : styles.toolbarText
            }
          >
            {isRevealPending ? "Updating…" : "Reveal amounts"}
          </Text>
        </Pressable>
      )}
    </View>
  );

  if (isPending && !data) {
    return (
      <Screen>
        {revealToolbar}
        <View style={styles.center}>
          <TransactionListSkeleton />
        </View>
      </Screen>
    );
  }

  if (isError && !data) {
    return (
      <Screen>
        <ErrorState
          message={mapUnknownToAppError(error).message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  const list = data ?? [];

  return (
    <Screen>
      {revealToolbar}
      <View style={styles.card}>
        <FlatList
          style={styles.flex}
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TransactionListItem
              transaction={item}
              onPress={handleTransactionPress}
              showBottomBorder={index < list.length - 1}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No transactions"
              description="Pull down to refresh."
            />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl }}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  toolbarBtn: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  toolbarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0019FF",
  },
  toolbarTextMuted: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  toolbarTextDisabled: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  flex: {
    flex: 1,
  },
});
