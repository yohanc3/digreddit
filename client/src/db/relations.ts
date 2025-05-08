import { relations } from "drizzle-orm/relations";
import { products, commentLeads, postLeads, users, session, account, authenticator } from "./schema";

export const commentLeadsRelations = relations(commentLeads, ({one}) => ({
	product: one(products, {
		fields: [commentLeads.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	commentLeads: many(commentLeads),
	postLeads: many(postLeads),
}));

export const postLeadsRelations = relations(postLeads, ({one}) => ({
	product: one(products, {
		fields: [postLeads.productId],
		references: [products.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	authenticators: many(authenticator),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(users, {
		fields: [authenticator.userId],
		references: [users.id]
	}),
}));