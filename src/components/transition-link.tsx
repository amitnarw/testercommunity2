"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useTransitionContext } from "@/context/transition-context";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export function TransitionLink({
  children,
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { triggerTransition } = useTransitionContext();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    // Call the passed onClick handler first (e.g., to close the menu)
    onClick?.(e);
    // Then trigger the page transition
    triggerTransition(href.toString());
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
