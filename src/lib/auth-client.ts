import { createAuthClient } from "better-auth/react";

/**
 * Backend user type with additional fields defined in Prisma schema
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: "OWNER" | "STAFF" | "BUYER";
  contact?: string | null;
  address?: string | null;
  isActive?: boolean;
  idLine?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: string | Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Better Auth client connected to backend Ceciz API
 * VITE_AUTH_URL defaults to http://localhost:3005
 */
export const authClient = createAuthClient({
  baseURL:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_AUTH_URL) ||
    "http://localhost:3005",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

/**
 * Helper to map backend Role ("OWNER" | "STAFF") to frontend format ("owner" | "staff")
 */
export function mapBackendRoleToFrontend(
  role?: string | null
): "owner" | "staff" | null {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (upper === "OWNER") return "owner";
  if (upper === "STAFF") return "staff";
  return null;
}

/**
 * Helper to check if a user has admin dashboard privileges
 */
export function isAllowedAdminRole(role?: string | null): boolean {
  if (!role) return false;
  const upper = role.toUpperCase();
  return upper === "OWNER" || upper === "STAFF";
}
