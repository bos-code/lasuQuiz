import supabase from "../../utils/supabase";
import type { LoginCredentials, RegisterData, User } from "../../types/auth";
import type { UserRole } from "../../types/user";

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
 */
export async function signUp(data: RegisterData) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Failed to create user");
  }

  // Create user profile with role
  // Adjust this based on your Supabase schema
  const { error: profileError } = await supabase
    .from("user_profiles")
    .insert({
      id: authData.user.id,
      email: data.email,
      name: data.name,
      role: data.role,
    });

  if (profileError) {
    throw profileError;
  }

  return authData;
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


