import React, { createContext, useContext, useMemo, useState } from "react";

// Business & Influencer App ships as one binary with two login types (see
// docs/02-apps-and-architecture.md). This context just tracks which role the
// current session is in — real auth comes later, once the backend exists.
type AppRole = "business" | "influencer" | null;

type AuthContextValue = {
  role: AppRole;
  signInAs: (role: Exclude<AppRole, null>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      signInAs: (r) => setRole(r),
      signOut: () => setRole(null),
    }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
