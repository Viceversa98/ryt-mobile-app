import type { Transaction } from "@/features/transactions/schemas/transaction.schema";

export const computeNetBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => {
    return t.type === "credit" ? sum + t.amount : sum - t.amount;
  }, 0);
};

export const primaryCurrency = (transactions: Transaction[]): string =>
  transactions[0]?.currency ?? "USD";
