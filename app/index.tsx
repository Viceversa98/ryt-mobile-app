import { Redirect } from "expo-router";

import { ROUTES } from "@/navigation/routes";
import { useAuthSessionStore } from "@/store/authSession.store";

export default function IndexRoute() {
  const isAuthenticated = useAuthSessionStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.DASHBOARD} />;
  }

  return <Redirect href={ROUTES.LOGIN} />;
}
