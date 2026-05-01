import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { OverviewFabTabButton } from "@/navigation/OverviewFabTabButton";
import { ROUTES } from "@/navigation/routes";
import { useAuthSessionStore } from "@/store/authSession.store";

const TAB_HEADER = {
  headerShown: true,
  headerTitleAlign: "center" as const,
  headerShadowVisible: true,
  headerStyle: { backgroundColor: "#FFFFFF" },
  headerTintColor: "#0B1020",
  headerTitleStyle: {
    fontWeight: "700" as const,
    fontSize: 17,
    color: "#0B1020",
  },
};

export default function AuthenticatedGroupLayout() {
  const isAuthenticated = useAuthSessionStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarActiveTintColor: "#0019FF",
        tabBarInactiveTintColor: "#64748B",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 6,
          minHeight: 58,
        },
      }}
    >
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          ...TAB_HEADER,
          title: "Dashboard",
          headerLeft: () => <View style={{ width: 40 }} />,
          tabBarShowLabel: false,
          tabBarIcon: () => null,
          tabBarButton: (props) => <OverviewFabTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          ...TAB_HEADER,
          title: "Menu",
          headerLeft: () => <View style={{ width: 40 }} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
