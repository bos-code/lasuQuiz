import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  useAuth as useClerkAuth,
  useClerk,
  useSignIn,
  useUser,
} from "@clerk/clerk-react";

type Profile = {
  id: string | null;
  email: string | null;
  role: "admin" | "user";
};

type AuthContextValue = {
  session: { userId: string } | null;
  profile: Profile | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithProvider: (provider: "google") => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = "chidera9713@gmail.com";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();
  const { signIn } = useSignIn();
  const { user } = useUser();
  const [session, setSession] = useState<AuthContextValue["session"]>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const normalizeRole = (value: unknown): Profile["role"] | undefined => {
    if (value === "admin" || value === "admins") return "admin";
    if (value === "user" || value === "users") return "user";
    return undefined;
  };

  const resolveRole = (email: string | null, currentUser: typeof user): Profile["role"] => {
    const metadataRole = normalizeRole(currentUser?.publicMetadata?.role) ?? normalizeRole(currentUser?.unsafeMetadata?.role);
    if (metadataRole) return metadataRole;
    return email === DEFAULT_ADMIN_EMAIL ? "admin" : "user";
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId || !user) {
      setSession(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress ?? null;
    setSession({ userId });
    setProfile({
      id: userId,
      email,
      role: resolveRole(email, user),
    });
    setLoading(false);
  }, [isLoaded, isSignedIn, user, userId]);

  const signInWithMagicLink = async (email: string) => {
    throw new Error(`Magic link sign-in is disabled for ${email}. Use email/password or social login.`);
  };

  const signInWithProvider = async (provider: "google") => {
    if (!signIn) throw new Error("Sign-in is not ready yet");
    if (provider !== "google") throw new Error("Only Google sign-in is supported");
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: `${window.location.origin}/sign-in`,
      redirectUrlComplete: `${window.location.origin}/admin`,
    });
  };

  const signOut = async () => {
    await clerkSignOut();
    setSession(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ session, profile, loading, signInWithMagicLink, signInWithProvider, signOut }),
    [loading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
