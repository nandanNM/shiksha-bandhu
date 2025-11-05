import { useAuth } from "@/providers/auth-provider";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated", isAuthenticated);
  if (!isAuthenticated) {
    return <Redirect href="../(auth)/sign-in.tsx" />;
  }

  return <Slot />;
}
