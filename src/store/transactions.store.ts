import { create } from "zustand";

import {
  TransactionsListSchema,
  type Transaction,
} from "@/features/transactions/schemas/transaction.schema";
import mockTransactions from "@/features/transactions/services/mock/transactions.mock.json";

const seedTransactions = (): Transaction[] =>
  TransactionsListSchema.parse(mockTransactions);

type TransactionsState = {
  transactions: Transaction[];
  getAll: () => Transaction[];
  getById: (id: string) => Transaction | undefined;
};

export const useTransactionsStore = create<TransactionsState>((_set, get) => ({
  transactions: seedTransactions(),
  getAll: () => [...get().transactions],
  getById: (id) => get().transactions.find((t) => t.id === id),
}));
