import Link from 'next/link';
import { ArrowRight, BarChart, CheckCircle, ChevronRight, LayoutGrid, Star, TestTube, Users, Smartphone, Bell, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimateTestLogo, GoldBadge, SilverBadge } from '@/components/icons';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from "next/image";

const features = [
  {
    icon: <LayoutGrid className="h-8 w-8 text-primary" />,
    title: 'Interactive Marketplace',
    description: 'Browse and connect with top-tier testers in a visually engaging, animated marketplace.',
    link: '/marketplace',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Real-Time Dashboards',
    description: 'Monitor your testing progress with dynamic charts and data visualizations that come to life.',
    link: '/dashboard',
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'Gamified Reputation',
    description: 'Level up your tester profile with animated XP bars and unlockable achievement badges.',
    link: '/#reputation',
  },
  {
    icon: <TestTube className="h-8 w-8 text-primary" />,
    title: 'Seamless Bug Reporting',
    description: 'An intuitive and animated bug reporting experience that testers will love.',
    link: '/',
  },
];

const testimonials = [
  {
    name: 'Sarah Jennings',
    role: 'Lead Developer, TechNova',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    comment: 'AnimateTest has revolutionized our QA process. The real-time feedback and detailed reports are game-changers. The platform isn\'t just functional, it\'s a joy to use!',
  },
  {
    name: 'Mike Valerio',
    role: 'Indie Game Developer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man smiling',
    comment: 'Finding the right testers used to be a nightmare. The gamified marketplace made it fun and easy to connect with experienced, reliable people. My app is better for it.',
  },
  {
    name: 'Chen Lin',
    role: 'Product Manager, Innovate Inc.',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'person glasses',
    comment: 'The dashboards are incredible. Being able to visualize our testing data with such clarity and beauty has helped us identify critical issues faster than ever before.',
  },
];

const appFeatures = [
    {
        icon: <Bell className="h-6 w-6 text-primary" />,
        title: "Real-time Notifications",
        description: "Get instant alerts for new test invites, bug reports, and messages."
    },
    {
        icon: <Flag className="h-6 w-6 text-primary" />,
        title: "On-the-Go Reporting",
        description: "Submit bug reports with attachments directly from your device."
    },
    {
        icon: <Smartphone className="h-6 w-6 text-primary" />,
        title: "Manage Anywhere",
        description: "Access your dashboard, manage projects, and track progress on the fly."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden bg-dot-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Now in Public Beta</Badge>
              </div>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-bold mt-4">
                The Future of App Testing is Animated
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                AnimateTest is a next-generation platform that connects developers with expert testers through a dynamic, gamified, and visually stunning experience.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="font-bold rounded-xl">
                  <Link href="/signup">Get Started for Free <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold rounded-xl">
                  <Link href="/marketplace">Explore Testers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">A Platform That Works as Good as It Looks</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                We've merged cutting-edge functionality with Awwwards-caliber design to create an unparalleled testing experience.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <Card key={feature.title} className="bg-card hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 rounded-xl">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Link href={feature.link} className="flex items-center text-primary font-semibold mt-4 hover:underline">
                      Learn More <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gamified Reputation Section */}
        <section id="reputation" className="py-20 md:py-28 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline">Gamified Reputation</Badge>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mt-4">Stand Out. Level Up. Get Noticed.</h2>
              <p className="mt-4 text-muted-foreground">Our gamified system makes testing more engaging and rewarding. Earn XP, unlock badges, and climb the leaderboards to showcase your skills.</p>
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Reputation Level: Pro Tester</span>
                    <span className="text-sm font-mono text-primary">XP 4500 / 6000</span>
                  </div>
                  <Progress value={75} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary rounded-xl" />
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-background border">
                        <GoldBadge className="h-8 w-8"/>
                        <span className="font-semibold">Top 1% Bug Hunter</span>
                    </div>
                     <div className="flex items-center gap-2 p-3 rounded-xl bg-background border">
                        <SilverBadge className="h-8 w-8"/>
                        <span className="font-semibold">UI/UX Specialist</span>
                    </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 w-full">
                <Image src="https://placehold.co/600x400.png" alt="Gamified dashboard" layout="fill" objectFit="cover" className="rounded-xl shadow-2xl" data-ai-hint="abstract gaming" />
            </div>
          </div>
        </section>

        {/* Google App Coming Soon Section */}
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-96 w-full">
                    <Image src="https://placehold.co/600x400.png" alt="AnimateTest Google App" layout="fill" objectFit="cover" className="rounded-xl shadow-2xl" data-ai-hint="mobile app interface" />
                </div>
                <div>
                    <Badge variant="secondary">Coming Soon</Badge>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold mt-4">AnimateTest, Now in Your Pocket</h2>
                    <p className="mt-4 text-muted-foreground">
                        Get ready to experience AnimateTest like never before. Our native Google app is in the works, bringing all the platform's features right to your mobile device. Stay tuned for updates!
                    </p>
                    <ul className="mt-6 space-y-4">
                        {appFeatures.map((feature) => (
                            <li key={feature.title} className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <Button variant="outline" disabled className="rounded-xl">Notify Me (Coming Soon)</Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Trusted by a Community of Innovators</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                See what developers and testers are saying about AnimateTest.
              </p>
            </div>
            <Carousel className="mt-12 w-full" opts={{ loop: true }}>
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.name} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full bg-card rounded-xl">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{testimonial.name}</CardTitle>
                              <CardDescription>{testimonial.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">&ldquo;{testimonial.comment}&rdquo;</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Elevate Your Testing?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Join the community and experience the future of app testing today. It's free to get started.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl">
                <Link href="/signup">Sign Up Now <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
