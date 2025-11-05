import { useAuth } from "@/providers/auth-provider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuth();

  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
