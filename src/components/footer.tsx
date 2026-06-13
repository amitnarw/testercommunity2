"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" className={className} fill="currentColor">
    <path d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 576 512" className={className} fill="currentColor">
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
);
import { useScroll, useTransform, motion } from "framer-motion";
import { Logo } from "./logo";
import { ROUTES } from "@/lib/routes";

const platformItems = [
  { name: "Home", href: ROUTES.PUBLIC.HOME },
  { name: "How It Works", href: ROUTES.PUBLIC.HOW_IT_WORKS },
  { name: "Pricing", href: ROUTES.PUBLIC.PRICING },
  { name: "Reviews", href: ROUTES.PUBLIC.REVIEWS },
  { name: "About Us", href: "/about" },
];

const resourceItems = [
  { name: "Blog", href: ROUTES.PUBLIC.BLOG },
  { name: "FAQ", href: "/faq" },
  { name: "Support", href: "/help" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Guides", href: "/guides" },
];

const legalItems = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Refund Policy", href: "/refund-policy" },
];

export function Footer() {
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax effect for the big text
  const testersY = useTransform(scrollYProgress, [0.9, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <footer
      data-loc="Footer"
      ref={footerRef}
      className="bg-secondary/30 backdrop-blur-3xl sticky bottom-0 h-screen w-full overflow-hidden flex flex-col justify-center border-t border-primary/5 z-0"
    >
      <div className="w-full max-w-[1800px] mx-auto p-6 md:p-12 lg:p-16 flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-24 relative z-20">
        {/* Left Column */}
        <div className="hidden lg:flex flex-col shrink-0 lg:justify-center gap-8 md:gap-12 order-2 lg:order-none">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 group mb-6"
            >
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Logo />
              </div>
              <span className="font-bold text-xl lg:text-2xl tracking-tight">
                inTesters
              </span>
            </Link>

            <h2 className="block text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] max-w-2xl">
              Ready to ship <br />
              <span className="text-primary/80 italic">your apps?</span>
            </h2>
          </div>

          {/* Desktop: Content */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="flex gap-3">
              <SocialButton icon={<XIcon className="w-5 h-5" />} href="https://x.com/inTesters" />
              <SocialButton icon={<RedditIcon className="w-5 h-5" />} href="https://www.reddit.com/r/inTesters" />
              <SocialButton icon={<TelegramIcon className="w-5 h-5" />} href="https://t.me/inTesters" />
              <SocialButton icon={<YoutubeIcon className="w-5 h-5" />} href="https://www.youtube.com/@intesters" />
              <SocialButton icon={<LinkedInIcon className="w-5 h-5" />} href="https://www.linkedin.com/showcase/intesters/" />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base text-muted-foreground">
                &copy; {new Date().getFullYear()} GAMDIX PRIVATE LIMITED
              </p>
              <Link
                href="#"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  width={130}
                  height={39}
                  alt="Google Play Store"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Navigation Links */}
        <div className="flex flex-col lg:justify-center order-1 lg:order-none">
          {/* Mobile Only: Logo outside the grid */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 group mb-10 lg:hidden"
          >
            <div className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Logo />
            </div>
            <span className="font-bold text-xl tracking-tight">inTesters</span>
          </Link>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-12">
            <div className="space-y-2 lg:space-y-4">
              <h4 className="font-medium text-sm lg:text-base text-primary/80 uppercase tracking-widest">
                Platform
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {platformItems.map((item) => (
                  <FooterLink
                    key={item.name}
                    href={item.href}
                    name={item.name}
                  />
                ))}
              </ul>
            </div>

            <div className="space-y-2 lg:space-y-4">
              <h4 className="font-medium text-sm lg:text-base text-primary/80 uppercase tracking-widest">
                Resources
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {resourceItems.map((item) => (
                  <FooterLink
                    key={item.name}
                    href={item.href}
                    name={item.name}
                  />
                ))}
              </ul>
            </div>

            <div className="space-y-2 lg:space-y-4">
              <h4 className="font-medium text-sm lg:text-base text-primary/80 uppercase tracking-widest">
                Legal
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {legalItems.map((item) => (
                  <FooterLink
                    key={item.name}
                    href={item.href}
                    name={item.name}
                  />
                ))}
              </ul>
            </div>

            {/* Mobile Only: Branding (Text Only) positioned bottom right */}
            <div className="flex flex-col justify-end gap-4 lg:hidden">
              <h2 className="block text-2xl font-bold tracking-tighter leading-[1.1]">
                Ready to ship <br />
                <span className="text-primary/80 italic">your apps?</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Mobile: Bottom Elements */}
        <div className="lg:hidden flex flex-col gap-6 order-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <SocialButton icon={<XIcon className="w-5 h-5" />} href="https://x.com/inTesters" />
              <SocialButton icon={<RedditIcon className="w-5 h-5" />} href="https://www.reddit.com/r/inTesters" />
              <SocialButton icon={<TelegramIcon className="w-5 h-5" />} href="https://t.me/inTesters" />
              <SocialButton icon={<YoutubeIcon className="w-5 h-5" />} href="https://www.youtube.com/@intesters" />
              <SocialButton icon={<LinkedInIcon className="w-5 h-5" />} href="https://www.linkedin.com/showcase/intesters/" />
            </div>
            <Link
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                width={110}
                height={33}
                alt="Google Play Store"
                className="h-9 w-auto"
              />
            </Link>
          </div>

          {/* Integrated Copyright/Status without border */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GAMDIX PRIVATE LIMITED</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Systems normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Big Text Animation */}
      <motion.div
        style={{ y: testersY, opacity }}
        className="absolute -bottom-6 lg:-bottom-32 left-0 right-0 flex justify-center items-center pointer-events-none select-none z-10"
      >
        <span className="font-black text-[25vw] leading-none text-primary/5 tracking-tighter mix-blend-overlay">
          inTesters
        </span>
      </motion.div>
    </footer>
  );
}

function SocialButton({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
      asChild
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">{icon}</Link>
    </Button>
  );
}

function FooterLink({ href, name }: { href: string; name: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group text-muted-foreground hover:text-primary transition-colors relative block overflow-hidden text-sm lg:text-base"
      >
        <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
          {name}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 text-primary">
          {name}
        </span>
      </Link>
    </li>
  );
}
