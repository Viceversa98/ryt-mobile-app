import type { Href } from "expo-router";

export const ROUTES = {
  ROOT: "/" as Href,
  SPLASH: "/splash" as Href,
  LOGIN: "/login" as Href,
  DASHBOARD: "/dashboard" as Href,
  TRANSACTIONS: "/transactions" as Href,
  transactionDetail: (id: string): Href => `/transactions/${id}` as Href,
};
