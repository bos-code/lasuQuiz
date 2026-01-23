export type ClerkEmail = {
  id: string;
  email_address: string;
};

export type ClerkUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email_addresses: ClerkEmail[];
  created_at: number; // epoch ms
};

/**
 * Fetches a page of Clerk users via the Vercel function /api/clerk-users.
 * Requires CLERK_SECRET_KEY to be set on the server.
 */
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const listClerkUsers = async (limit = 50, offset = 0): Promise<ClerkUser[]> => {
  const res = await axios.get<ClerkUser[]>("/api/clerk-users", {
    params: { limit, offset },
  });
  return res.data;
};

export const useClerkUsers = (limit = 50, offset = 0) =>
  useQuery({
    queryKey: ["clerk-users", limit, offset],
    queryFn: () => listClerkUsers(limit, offset),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });
