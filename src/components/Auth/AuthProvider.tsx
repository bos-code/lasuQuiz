import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseClient";

type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "user";
};

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "twitter" | "discord") => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = "chidera9713@gmail.com";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const hydrateProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const email = session.user.email || "";
      const baseProfile: Profile = {
        id: session.user.id,
        email,
        role: email === DEFAULT_ADMIN_EMAIL ? "admin" : "user",
      };

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile({
            id: data.id,
            email: data.email,
            role: (data.role as Profile["role"]) || baseProfile.role,
          });
        } else {
          // seed profile if missing
          await supabase.from("profiles").insert([
            { id: session.user.id, email, role: baseProfile.role },
          ]);
          setProfile(baseProfile);
        }
      } catch (err) {
        console.error("Profile load error", err);
        setProfile(baseProfile);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    void hydrateProfile();
  }, [session]);

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const signInWithProvider = async (provider: "google" | "twitter" | "discord") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
