import LightButton from '../button/light';
import Link from 'next/link';
import { FullLogo } from '../logo';
import { Session } from 'next-auth';
import SignIn from '../signin';

export default async function Header({ session }: { session: Session | null }) {
    return (
        <header className="container mx-auto py-6 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FullLogo />
            </div>
            <nav className="hidden md:flex justify-center items-center gap-9">
                <Link
                    href="#how-it-works"
                    className="text-sm font-semibold hover:text-[#576F72] transition-colors"
                >
                    How It Works
                </Link>
                <Link
                    href="#pricing"
                    className="text-sm font-semibold hover:text-[#576F72] transition-colors"
                >
                    Pricing
                </Link>
                <Link
                    href="#faq"
                    className="text-sm font-semibold hover:text-[#576F72] transition-colors"
                >
                    FAQ
                </Link>
                <Link
                    href="#contact"
                    className="text-sm font-semibold hover:text-[#576F72] transition-colors"
                >
                    Contact
                </Link>
            </nav>
            <SignIn session={session} />
            <LightButton title="Menu" className="md:hidden">
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </>
            </LightButton>
        </header>
    );
}
