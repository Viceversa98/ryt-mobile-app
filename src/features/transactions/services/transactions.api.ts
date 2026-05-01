import { ValidationError, NotFoundError } from "@/lib/errors";
import {
  TransactionSchema,
  TransactionsListSchema,
} from "@/features/transactions/schemas/transaction.schema";
import type { Transaction } from "@/features/transactions/schemas/transaction.schema";
import { useTransactionsStore } from "@/store/transactions.store";

const MOCK_LATENCY_MS = 400;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const parseTransactions = (raw: unknown): Transaction[] => {
  try {
    return TransactionsListSchema.parse(raw);
  } catch (e) {
    throw new ValidationError(
      e instanceof Error
        ? e.message
        : "Failed to validate transactions payload",
    );
  }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await delay(MOCK_LATENCY_MS);
  const list = useTransactionsStore.getState().getAll();
  return parseTransactions(list);
};

export const fetchTransactionById = async (
  id: string,
): Promise<Transaction> => {
  await delay(MOCK_LATENCY_MS);
  const raw = useTransactionsStore.getState().getById(id);
  if (!raw) {
    throw new NotFoundError(`Transaction ${id} was not found`);
  }
  try {
    return TransactionSchema.parse(raw);
  } catch (e) {
    throw new ValidationError(
      e instanceof Error ? e.message : "Failed to validate transaction",
    );
  }
};
