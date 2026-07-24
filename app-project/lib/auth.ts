import "server-only";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal length to reduce (not eliminate) the
    // length-based timing signal, then report false.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export interface CredentialCheckResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates submitted credentials against ADMIN_USERNAME / ADMIN_PASSWORD.
 * Credentials are never hardcoded — both must be present in the environment
 * or every login attempt is rejected.
 */
export function validateCredentials(
  username: string,
  password: string
): CredentialCheckResult {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envUsername || !envPassword) {
    return {
      valid: false,
      error: "Admin credentials are not configured on the server.",
    };
  }

  if (!username || !password) {
    return { valid: false, error: "Username and password are required." };
  }

  const usernameMatches = safeCompare(username, envUsername);
  const passwordMatches = safeCompare(password, envPassword);

  if (!usernameMatches || !passwordMatches) {
    return { valid: false, error: "Invalid username or password." };
  }

  return { valid: true };
}
