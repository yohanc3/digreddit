import { relations } from 'drizzle-orm/relations';
import {
    products,
    commentLeads,
    postLeads,
    users,
    session,
    account,
    authenticator,
    feedback,
    bookmarks,
    collections,
} from './schema';

export const commentLeadsRelations = relations(commentLeads, ({ one }) => ({
    product: one(products, {
        fields: [commentLeads.productID],
        references: [products.id],
    }),
    bookmark: one(bookmarks, {
        fields: [commentLeads.bookmarkID],
        references: [bookmarks.id],
    }),
}));

export const productsRelations = relations(products, ({ many }) => ({
    commentLeads: many(commentLeads),
    postLeads: many(postLeads),
    bookmarks: many(bookmarks),
    collections: many(collections),
}));

export const postLeadsRelations = relations(postLeads, ({ one }) => ({
    product: one(products, {
        fields: [postLeads.productID],
        references: [products.id],
    }),
    bookmark: one(bookmarks, {
        fields: [postLeads.bookmarkID],
        references: [bookmarks.id],
    }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(users, {
        fields: [session.userId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    authenticators: many(authenticator),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(users, {
        fields: [account.userId],
        references: [users.id],
    }),
}));

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
    user: one(users, {
        fields: [authenticator.userId],
        references: [users.id],
    }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
    user: one(users, {
        fields: [feedback.userId],
        references: [users.id],
    }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
    product: one(products, {
        fields: [bookmarks.productID],
        references: [products.id],
    }),
}));

export const collectionsRelations = relations(collections, ({ one }) => ({
    product: one(products, {
        fields: [collections.productID],
        references: [products.id],
    }),
}));
