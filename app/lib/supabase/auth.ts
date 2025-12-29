import supabase from "../../utils/supabase";
import type { LoginCredentials, RegisterData, User } from "../../types/auth";
import type { UserRole } from "../../types/user";
import { sendVerificationEmail, verifyCodeFromDB } from "./email";

/**
 * Get current user session
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  // Fetch user role from your user_profiles table
  // Adjust this query based on your Supabase schema
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, name")
    .eq("id", session.user.id)
    .single();

  const user: User | null = session.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        role: (profile?.role as UserRole) || "student",
        name: profile?.name,
      }
    : null;

  return { session, user };
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign up new user
 * Note: All new registrations are automatically assigned "student" role.
 * Admin roles must be assigned manually in the database by an existing admin.
 */
export async function signUp(data: RegisterData) {
  // Get origin for redirect URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Create auth user with email confirmation disabled (we'll use custom verification)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        name: data.name,
      },
    },
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Failed to create user");
  }

  // Skip email verification for now - create profile immediately
  // TODO: Re-enable email verification once email sending is configured
  const { error: profileError } = await supabase.from("user_profiles").insert({
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: "student",
  });

  if (profileError) {
    // If profile creation fails, still return auth data
    // User can verify email later if needed
    console.error("Failed to create user profile:", profileError);
  }

  return authData;
}

/**
 * Verify email with 4-digit code
 */
export async function verifyEmail(code: string, email?: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not found. Please sign in again.");
  }

  const userEmail = email || user.email;
  if (!userEmail) {
    throw new Error("Email not found.");
  }

  // Try to verify from database first
  const dbVerification = await verifyCodeFromDB(userEmail, code);
  
  if (dbVerification.valid) {
    // Code verified from database, proceed
  } else {
    // Fallback to user metadata (for development)
    const storedCode = user.user_metadata?.verification_code;
    const codeExpires = user.user_metadata?.verification_code_expires;

    if (!storedCode) {
      throw new Error("No verification code found. Please register again.");
    }

    if (codeExpires && new Date(codeExpires) < new Date()) {
      throw new Error("Verification code has expired. Please register again.");
    }

    if (storedCode !== code) {
      throw new Error("Invalid verification code. Please try again.");
    }
  }

  // Verify email and create user profile
  const { error: verifyError } = await supabase.auth.updateUser({
    email_confirm: true,
    data: {
      email_verified: true,
      verification_code: null,
      verification_code_expires: null,
    },
  });

  if (verifyError) {
    throw verifyError;
  }

  // Create user profile after email verification
  const { error: profileError } = await supabase.from("user_profiles").insert({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split("@")[0],
    role: "student",
  });

  if (profileError) {
    throw profileError;
  }

  return { success: true };
}

/**
 * Resend verification code
 */
export async function resendVerificationCode(email: string) {
  // Generate new code
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Send email with new code
  const emailResult = await sendVerificationEmail(email, verificationCode);

  // Fallback: Store in user metadata if needed
  if (!emailResult.success && emailResult.fallback) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.updateUser({
        data: {
          verification_code: verificationCode,
          verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      });
    }

    if (import.meta.env.DEV) {
      console.log("📧 New verification code for", email, ":", verificationCode);
    }
  }

  return { success: true };
}

/**
 * Sign in with OAuth provider (Google, Apple)
 */
export async function signInWithOAuth(provider: "google" | "apple") {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: origin ? `${origin}/auth/callback` : undefined,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const sessionData = await getSession();
  return sessionData?.user || null;
}


