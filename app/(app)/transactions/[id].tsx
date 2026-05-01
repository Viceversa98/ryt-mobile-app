import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useLayoutEffect } from "react";
import { Alert } from "react-native";

import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import { useRevealAmounts } from "@/features/auth/hooks/useRevealAmounts";
import { expoBiometricService } from "@/features/auth/services/expoBiometric.service";
import { TransactionDetailCard } from "@/features/transactions/components/TransactionDetailCard";
import { useTransaction } from "@/features/transactions/hooks/useTransaction";
import { mapUnknownToAppError } from "@/lib/errors";
import { useRevealStore } from "@/store/reveal.store";

const resolveIdParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export default function TransactionDetailRoute() {
  const navigation = useNavigation();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = resolveIdParam(rawId);
  const { data, isPending, isError, error, refetch } = useTransaction(id);
  const isAmountsRevealed = useRevealStore((s) => s.isAmountsRevealed);
  const {
    mutate: requestRevealAmounts,
    reset: resetRevealMutation,
  } = useRevealAmounts({
    biometricService: expoBiometricService,
  });
  const loadedTransactionId = data?.id;

  useFocusEffect(
    useCallback(() => {
      if (!id || !loadedTransactionId || loadedTransactionId !== id) {
        return undefined;
      }
      if (isAmountsRevealed) {
        return undefined;
      }

      const handle = setTimeout(() => {
        Alert.alert(
          "Reveal amount?",
          "Amounts are hidden. Show the amount for this transaction?",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Reveal",
              onPress: () => {
                resetRevealMutation();
                requestRevealAmounts();
              },
            },
          ],
        );
      }, 300);

      return () => {
        clearTimeout(handle);
      };
    }, [
      id,
      loadedTransactionId,
      isAmountsRevealed,
      requestRevealAmounts,
      resetRevealMutation,
    ]),
  );

  useLayoutEffect(() => {
    if (!data?.description) {
      return;
    }
    const raw = data.description.trim();
    const title =
      raw.length > 26 ? `${raw.slice(0, 26).trimEnd()}…` : raw;
    navigation.setOptions({ title });
  }, [data?.description, navigation]);

  if (!id) {
    return (
      <Screen>
        <ErrorState message="Missing transaction id" />
      </Screen>
    );
  }

  if (isPending) {
    return (
      <Screen>
        <LoadingState message="Loading transaction…" />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <ErrorState
          message={mapUnknownToAppError(error).message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <TransactionDetailCard transaction={data} />
    </Screen>
  );
}
