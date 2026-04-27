import { getServerSession } from "next-auth";

import { authOptions } from "@/modules/auth/server/auth-options";

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
