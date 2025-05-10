'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import LightButton from './button/light';
import { signIn } from 'next-auth/react';

export default function SignIn({ session }: { session: Session | null }) {
    return (
        <Link href={session ? '/dashboard' : '/'}>
            <LightButton
                title={session ? 'Dashboard' : 'Log In'}
                className="hidden md:flex"
                onClick={() => {
                    if (!session)
                        signIn('google', { redirectTo: '/dashboard' });
                }}
            />
        </Link>
    );
}
