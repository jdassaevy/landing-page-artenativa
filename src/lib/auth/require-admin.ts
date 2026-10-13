import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AdminIdentity {
  id: string;
  email: string | null;
}

export class AdminAuthorizationError extends Error {
  constructor(message = "Acesso administrativo não autorizado.") {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

type ClaimRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ClaimRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function authorizeAdminClaims(claims: unknown): AdminIdentity {
  if (!isRecord(claims) || typeof claims.sub !== "string" || claims.sub.length === 0) {
    throw new AdminAuthorizationError("Sessão administrativa inválida.");
  }

  const appMetadata = isRecord(claims.app_metadata) ? claims.app_metadata : {};

  if (appMetadata.role !== "admin") {
    throw new AdminAuthorizationError();
  }

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    throw new AdminAuthorizationError("Não foi possível validar a sessão administrativa.");
  }

  return authorizeAdminClaims(data?.claims ?? null);
}
