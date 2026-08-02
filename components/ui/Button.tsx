import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "brand" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-canvas hover:bg-ink/88",
  secondary: "border border-ash bg-surface-elevated text-ink hover:border-brand-muted hover:bg-brand-wash/40",
  brand: "bg-brand-deep text-canvas hover:bg-brand-deep/90",
  ghost: "text-ink-soft hover:bg-ash/60 hover:text-ink",
};

const base =
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
