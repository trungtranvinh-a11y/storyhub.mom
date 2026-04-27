import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractProjectId(pathname: string) {
  const match = pathname.match(/^\/app\/projects\/([^/]+)/);
  return match?.[1] ?? null;
}
