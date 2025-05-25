import { db } from '@/db';
import { account, session, users } from '@/db/schema';
import { betaUsersEmails } from '@/lib/backend/constant/betaUsers';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        accountsTable: account as never,
        sessionsTable: session as never,
        usersTable: users as never,
    }),
    providers: [Google],
    pages: {
        signIn: '/',
    },
    callbacks: {
        authorized: async ({ auth, request }) => {
            if (auth && auth.user && auth.user.email) {
                if (betaUsersEmails.includes(auth.user.email)) {
                    return true;
                }
            }

            console.log('auth invalid: ', auth);
            return NextResponse.redirect(new URL('/', request.url));
        },
        signIn: async ({ user }) => {
            if (user && user.email) {
                if (betaUsersEmails.includes(user.email)) {
                    return true;
                }
            }

            // return false;
            const returnURL = new URL('/non-beta-user', process.env.AUTH_URL);
            return returnURL.toString();
        },
    },
    trustHost: true,
});
