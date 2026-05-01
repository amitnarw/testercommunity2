"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useTransitionContext } from "@/context/transition-context";
import { useRouter } from "next/navigation";

interface AutoTransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  locale?: string | false;
}

export function AutoTransitionLink({
  children,
  href,
  replace,
  scroll,
  prefetch,
  locale,
  ...props
}: AutoTransitionLinkProps) {
  const { triggerTransition } = useTransitionContext();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Allow default behavior for modifier keys (open in new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();

    // Check if transitions are enabled
    const enabled = localStorage.getItem("enable-page-transitions") !== "false";

    if (enabled) {
      triggerTransition(href.toString());
    } else {
      // Fallback to regular navigation
      if (replace) {
        router.replace(href.toString());
      } else {
        router.push(href.toString());
      }
    }
  };

  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      locale={locale}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}