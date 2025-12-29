import { redirect } from "react-router";
import { getCurrentUser } from "../supabase/auth";
import type { UserRole } from "../../types/user";

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

/**
 * Require specific role - redirects to appropriate dashboard if wrong role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === "admin") {
      throw redirect("/admin/dashboard");
    } else {
      throw redirect("/student/dashboard");
    }
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole(["admin"]);
}

/**
 * Require student role
 */
export async function requireStudent() {
  return requireRole(["student"]);
}



