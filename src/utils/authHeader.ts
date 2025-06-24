// utils/authHeader.ts
import { getAccessToken } from "@/utils/token";

/**
 * Returns the default headers for authenticated API requests.
 * Includes Content-Type and Authorization if token is present.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
