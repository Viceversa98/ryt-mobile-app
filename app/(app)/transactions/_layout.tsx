import { Stack } from "expo-router";

import { TransactionsHeaderBack } from "@/navigation/TransactionsNavHeader";

export default function TransactionsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerShadowVisible: true,
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#0B1020",
        headerTitleStyle: { fontWeight: "700", fontSize: 17, color: "#0B1020" },
        headerBackVisible: false,
        headerLeft: () => <TransactionsHeaderBack />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Transactions" }} />
      <Stack.Screen name="[id]" options={{ title: "Transaction" }} />
    </Stack>
  );
}
