"use server";

import { redirect } from "next/navigation";

import {
  AdminAuthorizationError,
  authorizeAdminClaims,
} from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, passwordResetSchema } from "@/schemas/auth";

export async function loginAdmin(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/admin/login?erro=campos");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect("/admin/login?erro=credenciais");
  }

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=credenciais");
  }

  try {
    authorizeAdminClaims(claimsData?.claims ?? null);
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      await supabase.auth.signOut();
      redirect("/admin/login?erro=acesso");
    }
    throw error;
  }

  redirect("/admin");
}

export async function requestAdminPasswordReset(formData: FormData) {
  const parsed = passwordResetSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    redirect("/admin/recuperar-senha?erro=email");
  }

  const supabase = await createServerSupabaseClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin.replace(/\/$/, "")}/admin/recuperar-senha`,
  });

  redirect("/admin/recuperar-senha?enviado=1");
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
