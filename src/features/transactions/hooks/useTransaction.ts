import { useQuery } from "@tanstack/react-query";

import { fetchTransactionById } from "@/features/transactions/services/transactions.api";

export const transactionQueryKey = (id: string) =>
  ["transactions", id] as const;

export const useTransaction = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? transactionQueryKey(id) : ["transactions", "__idle"],
    queryFn: () => fetchTransactionById(id as string),
    enabled: Boolean(id),
  });
};
