
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, Award, Zap, Rocket, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import Confetti from 'react-dom-confetti';

const JourneyStep = ({
  icon,
  title,
  description,
  details,
  isPro,
  isFirst = false,
  isLast = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  isPro: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.5 }}
      className={cn(
        "w-[300px] md:w-[350px] h-full flex-shrink-0 relative px-4",
        isFirst ? "pl-8 md:pl-16" : "",
        isLast ? "pr-8 md:pr-16" : ""
      )}
    >
      <div className={cn("h-full w-full rounded-2xl p-6 flex flex-col justify-center", isPro ? "bg-primary/10 border-primary/20 border" : "bg-secondary")}>
        <div className={cn("absolute flex items-center justify-center w-12 h-12 rounded-full border-4 bg-background left-1/2 -translate-x-1/2",
            isPro ? "bottom-[-24px] border-primary/50" : "top-[-24px] border-secondary-foreground/20"
        )}>
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
        <p className="text-muted-foreground text-sm text-center mb-4">{description}</p>
        <div className="text-center bg-background/50 p-3 rounded-lg text-xs">
            <p className="font-semibold text-foreground">{details}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function HowItWorksPage() {
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: horizontalScrollRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-65%']);
  const [isLaunchVisible, setIsLaunchVisible] = React.useState(false);

  return (
    <div className="bg-background text-foreground">
      <section className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-bold">The Journey to a Perfect App</h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-xl">
          Two distinct paths, one goal: flawless quality. Scroll to explore the journey.
        </p>
        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12"
        >
            <ArrowRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      <section ref={horizontalScrollRef} className="relative h-[200vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
           {/* The Road */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border/50"></div>
          <motion.div style={{ x }} className="flex h-full items-center gap-8">
            {/* Community Path - Top */}
            <div className="flex h-1/2 items-center">
                 <JourneyStep
                    isFirst
                    isPro={false}
                    icon={<Users className="w-6 h-6 text-secondary-foreground" />}
                    title="Join the Community"
                    description="Sign up for free and create your profile."
                    details="Time: 5 mins • Cost: Free"
                />
                 <JourneyStep
                    isPro={false}
                    icon={<Zap className="w-6 h-6 text-secondary-foreground" />}
                    title="Test to Earn"
                    description="Find bugs in others' apps to earn points and build reputation."
                    details="Time: 1-2 hours per cycle"
                />
                 <JourneyStep
                    isPro={false}
                    icon={<Award className="w-6 h-6 text-secondary-foreground" />}
                    title="Get Feedback"
                    description="Spend your points to get your own app tested by the community."
                    details="Wait: Feedback within 48 hours"
                />
            </div>
             {/* Pro Path - Bottom */}
            <div className="flex h-1/2 items-center">
                 <JourneyStep
                    isFirst
                    isPro={true}
                    icon={<Briefcase className="w-6 h-6 text-primary" />}
                    title="Post Your Project"
                    description="Define your testing needs and project scope."
                    details="Time: 15 mins"
                />
                <JourneyStep
                    isPro={true}
                    icon={<IndianRupee className="w-6 h-6 text-primary" />}
                    title="Hire a Professional"
                    description="Choose a vetted tester from our marketplace."
                    details="Cost: Starts at ₹999"
                />
                <JourneyStep
                    isPro={true}
                    icon={<Rocket className="w-6 h-6 text-primary" />}
                    title="Launch with Confidence"
                    description="Receive expert reports and launch a battle-tested app."
                    details="Cycle: 7-14 day projects"
                />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section 
        onViewportEnter={() => setIsLaunchVisible(true)}
        className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Confetti active={isLaunchVisible} config={{
            particleCount: 200,
            spread: 90,
            startVelocity: 40,
            elementCount: 200,
            decay: 0.9,
          }}/>
        </div>
        <Rocket className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-5xl md:text-7xl font-bold">You've Reached the <span className="text-primary">Launchpad</span></h2>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-xl">
          Your journey to a flawless app starts now. Choose your path and launch with the confidence of knowing your app is truly ready for the world.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
            <Link href="/signup">Begin Your Ascent <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
