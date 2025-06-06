'use client';

import { Button } from '@/lib/components/ui/button';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';

interface HeaderProps {
    session: Session | null;
}

export default function Header({ session }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#576F72] to-[#344054] bg-clip-text text-transparent">
                            DigReddit
                        </span>
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="#how-it-works"
                        className="text-sm font-medium hover:text-[#576F72] transition-colors"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#who-its-for"
                        className="text-sm font-medium hover:text-[#576F72] transition-colors"
                    >
                        Who It's For
                    </Link>
                    <Link
                        href="#faq"
                        className="text-sm font-medium hover:text-[#576F72] transition-colors"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium hover:text-[#576F72] transition-colors"
                    >
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {session ? (
                        <Button
                            variant="outline"
                            className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white"
                        >
                            <Link
                                href="/dashboard"
                                className="hidden md:block text-sm font-medium hover:text-[#576F72] transition-colors"
                            >
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            onClick={() =>
                                signIn('google', { redirectTo: '/dashboard' })
                            }
                            className="hidden md:block text-sm font-medium hover:text-[#576F72] transition-colors bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white"
                        >
                            Get Started
                        </Button>
                    )}
                    {/* <Button className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white">
                        Get Started
                    </Button> */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
