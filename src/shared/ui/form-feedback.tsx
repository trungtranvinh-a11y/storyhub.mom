import { cn } from "@/lib/utils";

export function FormFeedback({
  message,
  tone = "error",
}: {
  message?: string;
  tone?: "error" | "success";
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-2xl px-4 py-3 text-sm",
        tone === "error"
          ? "border border-rose-200 bg-rose-50 text-rose-700"
          : "border border-emerald-200 bg-emerald-50 text-emerald-700",
      )}
    >
      {message}
    </p>
  );
}

export function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) {
    return null;
  }

  return <p className="text-sm text-rose-700">{error[0]}</p>;
}
