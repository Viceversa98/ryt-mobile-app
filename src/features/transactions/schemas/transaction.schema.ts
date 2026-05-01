import { z } from "zod";

export const TransactionTypeSchema = z.enum(["debit", "credit"]);

export const TransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number(),
  currency: z.string().min(1).default("USD"),
  date: z.string().min(1),
  description: z.string().min(1),
  type: TransactionTypeSchema,
});

export const TransactionsListSchema = z.array(TransactionSchema);

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
