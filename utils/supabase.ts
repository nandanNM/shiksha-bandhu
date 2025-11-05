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
    console.log("--- ADD THIS URL TO SUPABASE ---");
    console.log(redirectUri);
    console.log("---------------------------------");
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
    try {
      const returnedUrl = (browserResult as any).url || "";
      const hashIndex = returnedUrl.indexOf("#");
      if (hashIndex !== -1) {
        const fragment = returnedUrl.substring(hashIndex + 1);
        const params = Object.fromEntries(new URLSearchParams(fragment));
        const access_token = params["access_token"];
        const refresh_token = params["refresh_token"];

        if (access_token) {
          const { data: sessionData, error: setError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            } as any);

          if (setError) {
            console.warn("setSession error:", setError.message || setError);
          } else {
            console.log("Session set from URL fragment:", sessionData);
            return sessionData;
          }
        } else {
          console.warn("No access_token found in redirect URL fragment.");
        }
      } else {
        console.warn("No URL fragment found in redirect URL to parse tokens.");
      }
    } catch (err: any) {
      console.warn(
        "Failed to parse or set session from redirect URL:",
        err?.message || err
      );
    }
  } catch (err: any) {
    console.error("Supabase login error:", err.message || err);
    return null;
  }
}

// Logout the current user
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
