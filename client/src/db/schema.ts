import {
    pgTable,
    foreignKey,
    uuid,
    text,
    smallint,
    timestamp,
    boolean,
    integer,
    jsonb,
    unique,
    doublePrecision,
    serial,
} from 'drizzle-orm/pg-core';

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
    userId: uuid().notNull(),
});

export const commentLeads = pgTable(
    'CommentLeads',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
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
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_product',
        }),
    ]
);

export const postLeads = pgTable(
    'PostLeads',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
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
    },
    (table) => [
        foreignKey({
            columns: [table.productID],
            foreignColumns: [products.id],
            name: 'fk_product',
        }),
    ]
);

export const session = pgTable(
    'Session',
    {
        sessionToken: text().primaryKey().notNull(),
        userId: text().notNull(),
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
    redditRefreshToken:text(),
    membershipEndsAt: timestamp({ mode: 'string' }).defaultNow(),
});

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

export const nonBetaUsers = pgTable('NonBetaUsers', {
    id: serial().primaryKey().notNull(),
    email: text().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const feedback = pgTable(
    'Feedback',
    {
        id: serial().primaryKey().notNull(),
        userId: text().notNull(),
        area: text().notNull(),
        feedback: text().notNull(),
        createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'feedback_userID_Users_id_fk',
        }).onDelete('cascade'),
    ]
);
