'use client';

import LightButton from '../button/light';
import { ArrowRight } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Hero({ session }: { session: Session | null }) {
    const router = useRouter();

    return (
        <section className="container mx-auto py-16 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Turn Reddit Conversations Into Hot Leads — In Real Time.
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        DigReddit scans every new post and comment on Reddit to
                        uncover valuable leads tailored to your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <LightButton
                            title="Get Started"
                            className="bg-[#576F72] hover:bg-[#475a5c]"
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
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </LightButton>

                        {/* <Link href="#demo">
                            <LightButton title="See It In Action" />
                        </Link> */}
                    </div>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                        src="/demo-image.png"
                        alt="DigReddit in action"
                        objectFit="contain"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#576F72]/20 to-[#7D9D9C]/20"></div>
                </div>
            </div>
        </section>
    );
}
