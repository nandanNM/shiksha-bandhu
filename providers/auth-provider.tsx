import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getProfileById } from "@/service/profile";
import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  profile: Profile | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  profile: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  // profile: Tables<"profiles"> | null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
