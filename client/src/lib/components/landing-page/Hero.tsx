'use client';

import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface HeroProps {
    session: Session | null;
}

export default function Hero({ session }: HeroProps) {
    const router = useRouter();

    return (
        <section className="container mx-auto py-16 px-4 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Badge
                            className="bg-[#576F72]/10 text-[#576F72] text-xs hover:bg-[#576F72]/20 w-fit h-4 px-2 font-semibold"
                            variant="default"
                        >
                            🚀 Real-time Reddit Lead Generation
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                            Turn Reddit Conversations Into{' '}
                            <span className="bg-gradient-to-r from-[#576F72] to-[#344054] bg-clip-text text-transparent">
                                Hot Leads
                            </span>{' '}
                            — In Real Time
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            DigReddit scans every new post and comment on Reddit
                            to uncover valuable leads tailored to your business.
                            Get notified instantly when potential customers
                            mention problems your product solves.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white"
                            onClick={() => {
                                if (!session) {
                                    signIn('google', {
                                        redirectTo: '/dashboard',
                                    });
                                } else {
                                    router.push('/dashboard');
                                }
                            }}
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        {/* <Button
                            size="lg"
                            variant="outline"
                            className="border-[#576F72] text-[#576F72] hover:bg-[#576F72]/5"
                        >
                            Watch Demo
                        </Button> */}
                    </div>

                    <div className="flex items-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>14-day free trial</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border">
                        <Image
                            src="/demo-image.png"
                            alt="DigReddit in action"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#576F72]/10 to-[#344054]/10"></div>
                    </div>

                    {/* Floating Stats Cards */}
                    <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">
                                Live Scanning
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            2,847 posts scanned
                        </p>
                    </div>

                    <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-[#576F72]" />
                            <span className="text-sm font-medium">
                                Hot Lead
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            95% match score
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
