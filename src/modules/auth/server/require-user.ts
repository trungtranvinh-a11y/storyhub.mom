import { unauthorized } from "next/navigation";

import { getServerAuthSession } from "@/modules/auth/server/session";
import { getAuthUserById } from "@/services/auth-service";

export async function requireAuthenticatedUser() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    unauthorized();
  }

  const user = await getAuthUserById(session.user.id);

  if (!user) {
    unauthorized();
  }

  return user;
}

export async function getAuthenticatedUserOrNull() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  return getAuthUserById(session.user.id);
}
