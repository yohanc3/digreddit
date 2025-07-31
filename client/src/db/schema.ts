import {
    pgTable,
    foreignKey,
    unique,
    text,
    integer,
    boolean,
    uuid,
    timestamp,
    jsonb,
    serial,
    smallint,
    doublePrecision,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const leadStage = pgEnum('lead_stage', [
    'identification',
    'initial_outreach',
    'engagement',
    'skipped',
]);
export const stages = pgEnum('stages', [
    'identification',
    'initial_outreach',
    'engagement',
    'skipped',
]);

export const authenticator = pgTable(
    'Authenticator',
    {
        credentialId: text().notNull(),
        userId: text().notNull(),
        providerAccountId: text().notNull(),
        credentialPublicKey: text().notNull(),
        counter: integer().notNull(),
        credentialDeviceType: text().notNull(),
        credentialBackedUp: boolean().notNull(),
        transports: text(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'authenticator_userId_Users_id_fk',
        }).onDelete('cascade'),
        unique('authenticator_credentialID_unique').on(table.credentialId),
    ]
);

export const products = pgTable('Products', {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    description: text().notNull(),
    url: text(),
    mrr: integer().default(0),
    industry: text().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    keywords: jsonb().notNull(),
    criteria: text()
        .default(
            ` 
   Community Relevance (0–2)
• Is the lead from a subreddit or post clearly related to the product’s niche or audience?
→ 2: Highly relevant niche (e.g. SaaS, solopreneurs, automation tools)
→ 1: Loosely relevant
→ 0: Irrelevant

User Intent or Pain Signal (0–2)
• Does the lead express a need, problem, or desire you can solve (e.g. “looking for,” “need help with,” “any recommendations”)?
→ 2: Clear, actionable intent or pain point
→ 1: Vague interest
→ 0: No discernible intent

Lead Magnet Fit / Openness (0–2)
• Is the user open to solutions, advice, free tools, resources, or trials? (e.g. “Would love a demo,” “Send me something,” “Trying to learn more…”)
→ 2: Explicit openness
→ 1: Implied openness
→ 0: No openness or resistant

Profile Credibility (0–2)
• Does the user appear to be a real Redditor (not spam or throwaway)? Check for:

Normal-looking username

Any mention of context (e.g. personal project, startup, etc.)
→ 2: Clearly real, relevant profile
→ 1: Unclear
→ 0: Looks fake/spam/throwaway
    `
        )
        .notNull(),
    userId: uuid().notNull(),
});

export const nonBetaUsers = pgTable('NonBetaUsers', {
    id: serial().primaryKey().notNull(),
    email: text().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const session = pgTable(
    'Session',
    {
        sessionToken: text().primaryKey().notNull(),
        userId: text().notNull(),

        // If this is set to string, an error is thrown
        expires: timestamp({ mode: 'date' }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'session_userId_Users_id_fk',
        }).onDelete('cascade'),
    ]
);

export const feedback = pgTable(
    'Feedback',
    {
        id: serial().primaryKey().notNull(),
        userId: text().notNull(),
        area: text().notNull(),
        feedback: text().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        attendedTo: boolean().default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'feedback_userID_Users_id_fk',
        }).onDelete('cascade'),
    ]
);

export const verificationToken = pgTable('VerificationToken', {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: 'string' }).notNull(),
});

export const account = pgTable(
    'Account',
    {
        userId: text().notNull(),
        type: text().notNull(),
        provider: text().notNull(),
        providerAccountId: text().notNull(),
        refreshToken: text('refresh_token'),
        accessToken: text('access_token'),
        tokenType: text('token_type'),
        scope: text(),
        idToken: text('id_token'),
        sessionState: text('session_state'),
        expiresAt: timestamp('expires_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'account_userId_Users_id_fk',
        }).onDelete('cascade'),
    ]
);

export const users = pgTable('Users', {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text(),
    emailVerified: timestamp({ mode: 'string' }),
    image: text(),
    membershipEndsAt: timestamp({ mode: 'string' }).defaultNow(),
    redditRefreshToken: text(),
});

export const commentLeads = pgTable(
    'CommentLeads',
    {
        id: text()
            .default(sql`gen_random_uuid()`)
            .notNull(),
        subreddit: text().notNull(),
        author: text().notNull(),
        body: text().notNull(),
        url: text().notNull(),
        ups: smallint().notNull(),
        downs: smallint().notNull(),
        productID: uuid().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        rating: doublePrecision().notNull(),
        isInteracted: boolean().default(false),
        stage: stages().default('identification').notNull(),
        uniqueID: uuid().defaultRandom().notNull().primaryKey(),
        bookmarkID: uuid()
            .default(sql`gen_random_uuid()`)
            .notNull(),
        criteriaResults: jsonb()
            .default(sql`'[]'::jsonb`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_product',
        }),
        unique('unique_commentleads_uniqueid').on(table.uniqueID),
    ]
);

export const postLeads = pgTable(
    'PostLeads',
    {
        id: text()
            .default(sql`gen_random_uuid()`)
            .notNull(),
        subreddit: text().notNull(),
        title: text().notNull(),
        author: text().notNull(),
        body: text().notNull(),
        url: text().notNull(),
        numComments: smallint().notNull(),
        subredditSubscribers: integer(),
        over18: boolean().notNull(),
        ups: smallint().notNull(),
        downs: smallint().notNull(),
        productID: uuid().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        rating: doublePrecision().notNull(),
        isInteracted: boolean().default(false),
        stage: stages().default('identification').notNull(),
        uniqueID: text()
            .default(sql`gen_random_uuid()`)
            .notNull()
            .primaryKey(),
        bookmarkID: uuid()
            .default(sql`gen_random_uuid()`)
            .notNull(),
        criteriaResults: jsonb().default(sql`'[]'::jsonb`),
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_product',
        }),
        unique('unique_postleads_uniqueid').on(table.uniqueID),
    ]
);

export const bookmarks = pgTable(
    'Bookmarks',
    {
        id: uuid()
            .default(sql`gen_random_uuid()`)
            .primaryKey()
            .notNull(),
        title: text().notNull(),
        description: text().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        userID: uuid().notNull(),
        productID: uuid().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_product',
        }).onDelete('cascade'),
    ]
);

export const collections = pgTable(
    'Collections',
    {
        id: uuid()
            .default(sql`gen_random_uuid()`)
            .primaryKey()
            .notNull(),
        title: text().notNull(),
        description: text().notNull(),
        subreddits: jsonb().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
        userID: uuid().notNull(),
        productID: uuid().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_collection_product',
        }),
    ]
);
