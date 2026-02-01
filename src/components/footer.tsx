"use client";

import { useRef } from "react";
import Link from "next/link";
import { SiteLogo } from "./icons";
import { Button } from "./ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

const platformItems = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Reviews", href: "/reviews" },
];

const resourceItems = [
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Support", href: "/help" },
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
      className="bg-secondary/30 backdrop-blur-3xl sticky bottom-0 h-screen w-full overflow-hidden flex flex-col justify-center border-t border-primary/5"
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
                <SiteLogo className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
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
              <SocialButton icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialButton icon={<Github className="w-5 h-5" />} href="#" />
              <SocialButton icon={<Linkedin className="w-5 h-5" />} href="#" />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base text-muted-foreground">
                &copy; {new Date().getFullYear()} inTesters Inc.
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
              <SiteLogo className="w-6 h-6 text-primary" />
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
              <SocialButton icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialButton icon={<Github className="w-5 h-5" />} href="#" />
              <SocialButton icon={<Linkedin className="w-5 h-5" />} href="#" />
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
            <p>&copy; {new Date().getFullYear()} inTesters Inc.</p>
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
        className="absolute -bottom-5 lg:-bottom-20 left-0 right-0 flex justify-center items-center pointer-events-none select-none z-10"
      >
        <span className="font-black text-[25vw] lg:text-[15vw] leading-none text-primary/5 tracking-tighter mix-blend-overlay">
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
      <Link href={href}>{icon}</Link>
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
