
'use client'

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, Award, Zap, FileText, IndianRupee, Rocket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

const sections = [
  {
    title: 'Getting Started',
    icon: <Users className="w-6 h-6" />,
    community: {
      title: 'Join the Community',
      description: 'Create your free account to become part of our collaborative testing ecosystem. It’s your passport to a world of shared knowledge and collective improvement.',
      details: 'Time: ~5 minutes'
    },
    professional: {
      title: 'Post Your Project',
      description: 'Define your testing needs, scope, and objectives. Invite our vetted professionals or let us match you with the perfect expert for your app.',
      details: 'Cost: Starts at ₹999'
    }
  },
  {
    title: 'The Work',
    icon: <Zap className="w-6 h-6" />,
    community: {
      title: 'Test Apps, Earn Points',
      description: 'Browse apps, find bugs, and submit reports. Every valid bug earns you points and boosts your reputation, making you a trusted name in the Tribe.',
      details: 'Time: ~1-2 hours per cycle'
    },
    professional: {
      title: 'Receive Actionable Reports',
      description: 'Your hired pro gets to work immediately, delivering a stream of detailed reports with logs, screenshots, and clear replication steps.',
      details: 'Time: First reports within 24 hours'
    }
  },
  {
    title: 'The Rewards',
    icon: <Award className="w-6 h-6" />,
    community: {
      title: 'Get Your App Tested',
      description: 'Spend your hard-earned points to get your own app tested by a diverse range of community members on various devices, uncovering unique issues.',
      details: 'Wait: First feedback within 48 hours'
    },
    professional: {
      title: 'Verify Fixes & Launch',
      description: 'Collaborate with your tester to verify fixes. Once all critical issues are resolved, you get a final report and are ready for a confident launch.',
      details: 'Time: 7-14 day project cycles'
    }
  }
];

const SectionCard = ({ community, professional }: { community: any, professional: any }) => (
    <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Community Card */}
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border/20 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-primary"/>
                    <h4 className="text-xl font-bold">Community Path <span className="text-sm font-normal text-muted-foreground">(Free)</span></h4>
                </div>
                <h5 className="font-semibold text-lg mb-2">{community.title}</h5>
                <p className="text-muted-foreground mb-4 flex-grow">{community.description}</p>
                <p className="text-xs font-semibold uppercase text-primary tracking-widest">{community.details}</p>
            </div>
            {/* Professional Card */}
            <div className="bg-card p-8 rounded-2xl border-2 border-primary/50 shadow-2xl shadow-primary/10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-primary"/>
                    <h4 className="text-xl font-bold">Professional Path <span className="text-sm font-normal text-muted-foreground">(Paid)</span></h4>
                </div>
                <h5 className="font-semibold text-lg mb-2">{professional.title}</h5>
                <p className="text-muted-foreground mb-4 flex-grow">{professional.description}</p>
                <p className="text-xs font-semibold uppercase text-primary tracking-widest">{professional.details}</p>
            </div>
        </div>
    </motion.div>
);


export default function HowItWorksPage() {
    const [activeSection, setActiveSection] = React.useState(0);
    const sectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setActiveSection(index);
                    }
                });
            },
            { rootMargin: "-50% 0px -50% 0px" }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <div className="bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <section className="py-20 md:py-28 text-center bg-secondary/30 relative">
                <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold">
                        Two Paths to a Perfect App
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                       Whether you're a bootstrapper who loves community collaboration or a business that needs guaranteed professional results, we have a journey designed for you.
                    </p>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Sticky Left Nav */}
                        <aside className="lg:col-span-1 lg:sticky top-28 h-min">
                             <h2 className="text-2xl font-bold mb-8">The Journey</h2>
                             <div className="space-y-4">
                                {sections.map((section, index) => (
                                    <div 
                                        key={index}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
                                            activeSection === index ? 'bg-primary/10 text-primary' : 'bg-transparent'
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-md",
                                            activeSection === index ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                        )}>
                                            {section.icon}
                                        </div>
                                        <span className="font-bold text-lg">{section.title}</span>
                                    </div>
                                ))}
                             </div>
                        </aside>

                        {/* Scrolling Right Content */}
                        <main className="lg:col-span-2 space-y-24">
                            {sections.map((section, index) => (
                                <div 
                                    key={index} 
                                    ref={el => sectionRefs.current[index] = el}
                                    data-index={index}
                                >
                                    <SectionCard community={section.community} professional={section.professional} />
                                </div>
                            ))}
                        </main>
                    </div>
                </div>
            </section>

             {/* CTA Section */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Rocket className="w-16 h-16 mx-auto text-primary mb-4" />
                        <h2 className="text-4xl md:text-5xl font-bold">Ready to <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Elevate</span> Your App?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                            Your journey to a flawless app starts now. Choose your path, join the tribe, and launch with ultimate confidence.
                        </p>
                        <div className="mt-8">
                            <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                                <Link href="/signup">Start Your Journey <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
