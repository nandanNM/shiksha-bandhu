import { createClient } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { Alert, AppState, Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let storage: any = undefined;
if (Platform.OS !== "web") {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  storage = AsyncStorage;
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// only be registered once.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

export async function login() {
  try {
    // Create redirect URI
    const redirectUri = makeRedirectUri({ scheme: "shikshabandhu" });
    // Ask Supabase for the Google login URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUri },
    });

    if (error) throw new Error(error.message);
    if (!data?.url) throw new Error("No OAuth URL returned from Supabase");

    // Open the Google login page in browser
    const browserResult = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUri
    );

    if (browserResult.type !== "success") {
      throw new Error("Login cancelled or failed");
    }
    console.log("✅ Browser flow complete. Waiting for auth listener...");
    console.log(browserResult);
  } catch (err: any) {
    console.error("Supabase login error:", err.message || err);
    return null;
  }
}

//Logout the current user
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    console.log("✅ Logged out successfully");
    return true;
  } catch (err: any) {
    console.error("Supabase logout error:", err.message || err);
    Alert.alert("Logout failed", err.message || "Something went wrong");
    return false;
  }
}
