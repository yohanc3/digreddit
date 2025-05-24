import { db } from '@/db';
import { account, session, users } from '@/db/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

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
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
    trustHost: true,
});
