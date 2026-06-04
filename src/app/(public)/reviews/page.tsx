"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Quote,
  Star,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getPublicTestimonials } from "@/lib/apiCallsAdmin";
import { getPublishedReviews } from "@/lib/apiCalls";
import { cn } from "@/lib/utils";
import { CTASection } from "@/components/cta-section";
import { Skeleton } from "@/components/ui/skeleton";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
  image?: string;
  appLink?: string;
  tags: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
}

interface PublishedReview {
  id: number;
  rating: number;
  comment: string;
  status: string;
  isPublished: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  androidApp?: {
    id: number;
    appName: string;
    packageName: string;
    dashboardAndHubs?: {
      appOwnerId: string;
    } | null;
  };
}

type ReviewItem = (Testimonial & { _type: "testimonial" }) | (PublishedReview & { _type: "review" });

export default function SuccessStoriesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userReviews, setUserReviews] = useState<PublishedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [testimonialData, reviewData] = await Promise.all([
          getPublicTestimonials(),
          getPublishedReviews(),
        ]);
        setTestimonials(testimonialData || []);
        setUserReviews(reviewData || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const allItems: ReviewItem[] = [
    ...testimonials.map((t) => ({ ...t, _type: "testimonial" as const })),
    ...userReviews.map((r) => ({ ...r, _type: "review" as const })),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern z-0 opacity-50"></div>

        {/* Ambient Glows */}
        <div className="absolute bottom-0 left-1/4 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">

            <HoverBorderGradient
              containerClassName="rounded-full m-auto mb-6"
              as="div"
              className="dark:bg-black text-[10px] sm:text-xs bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <BadgeCheck className="w-4 h-4 mr-2 text-primary" />
              <span>Verified Success Stories</span>
            </HoverBorderGradient>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading leading-tight tracking-tight font-bold mb-6 text-center mx-auto">
              Success Stories of the{" "}
              <span className="text-primary italic">
                Developers
              </span>
            </h1>

            <p className="text-lg md:text-xl font-body max-w-2xl mx-auto text-muted-foreground mb-10 leading-relaxed">
              Read what developers, testers, and product managers are saying
              about their experience with our platform. Real people, real
              results.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 bg-gray-50 dark:bg-zinc-950/30">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="break-inside-avoid rounded-3xl p-6 md:p-8 border border-border/50 bg-background">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
              {allItems.map((item, index) => {
                if (item._type === "testimonial") {
                  const testimonial = item;
                  return (
                    <motion.div
                      key={`t-${testimonial.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.6,
                        delay: (index % 3) * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className={cn(
                        "break-inside-avoid rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 flex flex-col relative group overflow-hidden transition-all duration-300 will-change-transform",
                        "bg-background hover:shadow-xl hover:border-primary/20",
                        index % 4 === 0 &&
                        "bg-gradient-to-br from-background to-blue-50/50 dark:from-background dark:to-blue-900/10",
                        index % 4 === 2 &&
                        "bg-gradient-to-br from-background to-amber-50/50 dark:from-background dark:to-amber-900/10",
                      )}
                    >
                      <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Quote className="w-16 h-16 text-primary rotate-12" />
                      </div>

                      {testimonial.image && (
                        <div className="w-full h-48 mb-6 relative rounded-2xl overflow-hidden group-hover:shadow-md transition-all">
                          <Image
                            src={testimonial.image}
                            alt="Review context"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4 drop-shadow-sm",
                              i < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>

                      <p
                        className={cn(
                          "text-muted-foreground leading-relaxed mb-6 font-medium relative z-10",
                          testimonial.comment.length < 100
                            ? "text-lg md:text-xl"
                            : "text-sm md:text-base",
                        )}
                      >
                        &ldquo;{testimonial.comment}&rdquo;
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(testimonial.tags || []).slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-secondary text-secondary-foreground border border-border/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-sm text-foreground truncate">
                            {testimonial.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground truncate">
                              {testimonial.role}
                            </span>
                            {testimonial.dataAiHint && (
                              <span
                                className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-green-500 animate-pulse"
                                title="Verified User"
                              />
                            )}
                          </div>
                        </div>

                        {testimonial.appLink && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Link
                              href={testimonial.appLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                }

                const review = item;
                return (
                  <motion.div
                    key={`r-${review.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 3) * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className={cn(
                      "break-inside-avoid rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 flex flex-col relative group overflow-hidden transition-all duration-300 will-change-transform",
                      "bg-background hover:shadow-xl hover:border-primary/20",
                      "bg-gradient-to-br from-background to-purple-50/50 dark:from-background dark:to-purple-900/10",
                    )}
                  >
                    <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Quote className="w-16 h-16 text-primary rotate-12" />
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4 drop-shadow-sm",
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>

                    <p
                      className={cn(
                        "text-muted-foreground leading-relaxed mb-6 font-medium relative z-10",
                        review.comment.length < 100
                          ? "text-lg md:text-xl"
                          : "text-sm md:text-base",
                      )}
                    >
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md bg-muted">
                        {review.user?.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                            {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="font-bold text-sm text-foreground truncate">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <div className="flex flex-col items-start gap-1">
                          {(() => {
                            const isOwner = review.user?.id === review.androidApp?.dashboardAndHubs?.appOwnerId;
                            return (
                              <>
                                <span className={cn(
                                  "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                  isOwner
                                    ? "text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/20"
                                    : "text-primary bg-primary/10"
                                )}>
                                  <ShieldCheck className="w-3 h-3" />
                                  {isOwner ? "Verified Developer" : "Verified Tester"}
                                </span>
                                {review.androidApp && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {isOwner ? "Developed" : "Tested"} {review.androidApp.appName}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {review.androidApp?.packageName && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
                        >
                          <a
                            href={`https://play.google.com/store/apps/details?id=${review.androidApp.packageName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Additional Social Proof / Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-12">
            Join thousands of happy users
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                10k+
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Active Testers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                50k+
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Bugs Reported
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                98%
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Satisfaction Rate
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                24h
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Avg. Turnaround
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
