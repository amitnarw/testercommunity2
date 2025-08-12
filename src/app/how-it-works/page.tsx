
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HowItWorksStep } from '@/components/how-it-works-step';
import { ArrowRight, Check, Users, Briefcase, Award, Zap, Heart, Target, Rocket, Flag, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const StatCard = ({ value, label, className }: {value: string, label: string, className?: string}) => (
    <motion.div 
        className={`bg-background/50 backdrop-blur-sm p-6 rounded-2xl text-center shadow-lg border ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <p className="text-4xl md:text-5xl font-bold text-primary">{value}</p>
        <p className="text-muted-foreground mt-2">{label}</p>
    </motion.div>
)

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
        {/* Hero Section */}
        <section className="py-20 md:py-28 text-center bg-secondary/30 relative">
             <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.h1 
                    className="text-4xl md:text-6xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    Your App's Journey to <span className="text-primary">Perfection</span>
                </motion.h1>
                <motion.p 
                    className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                   Join 2,000+ successful developers. See our proven process for squashing bugs, refining UX, and launching with confidence.
                </motion.p>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
                    <StatCard value="99%" label="Success Rate" />
                    <StatCard value="<6 Hrs" label="Tester Assignment" className="md:mt-8"/>
                    <StatCard value="<14 Days" label="To Production" />
                </div>
            </div>
        </section>

        {/* The Timeline Section */}
        <section className="py-20 md:py-28 relative">
            <div className="timeline-road"></div>
            <div className="container mx-auto px-4 md:px-6">

                <HowItWorksStep
                    step={1}
                    communityTitle="Join the Tribe & Build Your Profile"
                    communityIcon={<Users />}
                    communityDetails={{
                        what: "Create your account, choose your role (developer or tester), and set up your profile. This is your identity in the TestTribe ecosystem.",
                        why: "A complete profile builds trust. For developers, it provides context for testers. For testers, it showcases your skills and helps you get invited to exclusive projects.",
                        when: "Time: 5-10 Minutes"
                    }}
                    proTitle="Post Your Project & Define Your Needs"
                    proIcon={<Briefcase />}
                    proDetails={{
                        what: "Submit your app, specify testing requirements (e.g., UI/UX, security, performance), set your budget, and define the scope of the project.",
                        why: "A clear brief ensures you attract the right professionals. It eliminates ambiguity and guarantees you get the exact feedback you need, on time and on budget.",
                        when: "Time: 10-15 Minutes"
                    }}
                />

                <HowItWorksStep
                    step={2}
                    isReversed
                    communityTitle="Test Apps to Earn Points"
                    communityIcon={<Zap />}
                    communityDetails={{
                        what: "Browse community projects, pick one that interests you, and start testing. Report valid bugs you discover to earn points and build your reputation.",
                        why: "This is the core of our 'give-to-get' model. By contributing, you not only earn the currency to get your own app tested but also gain valuable experience and insights.",
                        when: "Time: Ongoing. Find your first bug in under an hour!"
                    }}
                    proTitle="Hire a Pro & Start the Clock"
                    proIcon={<IndianRupee />}
                    proDetails={{
                        what: "Browse our marketplace of vetted professionals. Review their profiles, expertise, and ratings. Hire the perfect tester for your project with a single click.",
                        why: "Why leave it to chance? Hiring a pro guarantees expert eyes on your app. You get peace of mind knowing a seasoned QA expert is dedicated to your project's success.",
                        when: "Cost: Starts at ₹999. Time: Less than 6 hours for tester assignment."
                    }}
                />

                 <HowItWorksStep
                    step={3}
                    communityTitle="Submit Your App for Testing"
                    communityIcon={<Rocket />}
                    communityDetails={{
                        what: "Once you've earned enough points, you can submit your own app to the community. Your project goes live, and testers from around the world can start testing.",
                        why: "Leverage the power of the crowd. Get your app tested on a massive range of devices, operating systems, and network conditions you could never replicate on your own.",
                        when: "Time: 5 minutes to submit. Typical Wait: 24-48 hours for first reports."
                    }}
                    proTitle="Receive Actionable Reports"
                    proIcon={<Check />}
                    proDetails={{
                        what: "Your hired professional gets to work immediately. They'll provide a stream of detailed, actionable bug reports, complete with logs, screenshots, and replication steps.",
                        why: "No more vague feedback. Pro reports are clear, concise, and designed to be immediately useful for your development team, dramatically speeding up your debugging process.",
                        when: "Time: First reports within 24 hours."
                    }}
                />

                 <HowItWorksStep
                    step={4}
                    isReversed
                    communityTitle="Get Diverse Feedback & Iterate"
                    communityIcon={<Award />}
                    communityDetails={{
                        what: "Watch as bug reports and usability feedback from a global community pour in. Review the findings, fix the bugs, and iterate on your app to make it better.",
                        why: "This isn't just about finding bugs; it's about gaining a global perspective on your app's usability and appeal, leading to a much stronger final product.",
                        when: "Time: Continuous feedback over a 7-day cycle."
                    }}
                    proTitle="Launch with Confidence"
                    proIcon={<Flag />}
                    proDetails={{
                        what: "Once the testing cycle is complete, you'll receive a final, comprehensive report summarizing all findings, and a 'TestTribe Certified' badge for your app.",
                        why: "Go to market with the ultimate assurance. A professional audit not only eliminates critical bugs but also serves as a powerful signal of quality to your users.",
                        when: "Time: Full cycle completed in 7-14 days."
                    }}
                />
            </div>
             <div className="timeline-road-finish">
                <Rocket className="w-6 h-6 text-primary" />
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold">You've Reached the <span className="text-primary">Launchpad</span></h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Your journey to a flawless app starts here. Choose your path and let's build something amazing together.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                        <Link href="/signup">Start Your Journey <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
