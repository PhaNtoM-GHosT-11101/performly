"use client";

import { type ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info" | "purple";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50  text-amber-700  border-amber-200",
  danger:  "bg-red-50    text-red-700    border-red-200",
  neutral: "bg-zinc-100  text-zinc-600   border-zinc-200",
  info:    "bg-sky-50    text-sky-700    border-sky-200",
  purple:  "bg-violet-50 text-violet-700 border-violet-200",
};

const dotClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  neutral: "bg-zinc-400",
  info:    "bg-sky-500",
  purple:  "bg-violet-500",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ variant = "neutral", children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className={clsx("h-1.5 w-1.5 rounded-full", dotClasses[variant])} />}
      {children}
    </span>
  );
}
