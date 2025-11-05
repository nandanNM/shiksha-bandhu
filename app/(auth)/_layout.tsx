// import { useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  // const { isAuthenticated } = useAuth();

  // if (isAuthenticated) {
  //   return <Redirect href="/(protected)/" />;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
