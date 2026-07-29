"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper shadow-sm hover:bg-marigold hover:text-ink hover:shadow-md active:scale-[0.98] dark:bg-ink-dark dark:text-paper-dark dark:hover:bg-marigold-light",
  secondary:
    "border border-line bg-surface text-ink hover:border-marigold hover:text-marigold active:scale-[0.98] dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark",
  outline:
    "border border-line bg-transparent text-ink hover:border-marigold hover:bg-marigold/5 hover:text-marigold active:scale-[0.98] dark:border-line-dark dark:text-ink-dark",
  ghost:
    "bg-transparent text-muted hover:bg-ink/5 hover:text-ink active:scale-[0.98] dark:text-muted-dark dark:hover:bg-white/5 dark:hover:text-ink-dark",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-full px-4 text-xs",
  md: "h-11 gap-2 rounded-full px-6 text-sm",
  lg: "h-[3.25rem] gap-2.5 rounded-full px-8 text-base",
  icon: "h-9 w-9 rounded-full",
};

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

const baseClasses = (variant: ButtonVariant, size: ButtonSize, className?: string) =>
  cn(
    "group relative inline-flex items-center justify-center whitespace-nowrap font-medium",
    "transition-all duration-200 ease-ledger",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

// Standard <button> — use for actions (submit, toggle, open modal, etc.)
export const Button = forwardRef<
  HTMLButtonElement,
  BaseButtonProps & Omit<HTMLMotionProps<"button">, keyof BaseButtonProps>
>(({ variant = "primary", size = "md", className, children, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={baseClasses(variant, size, className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});
Button.displayName = "Button";

// Link-flavored button — use for navigation (internal routes via next/link)
interface ButtonLinkProps extends BaseButtonProps {
  href: string;
  external?: boolean;
}

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  const classes = baseClasses(variant, size, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
