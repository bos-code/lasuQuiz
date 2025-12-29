import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, signOut as supabaseSignOut } from "../lib/supabase/auth";
import type { User } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await supabaseSignOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isStudent,
    logout,
    refresh: loadUser,
  };
}



