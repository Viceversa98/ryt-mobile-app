import { useQuery } from "@tanstack/react-query";

import { fetchTransactions } from "@/features/transactions/services/transactions.api";

export const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;

export const useTransactions = () => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: fetchTransactions,
  });
};
