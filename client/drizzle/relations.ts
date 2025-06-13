import { relations } from "drizzle-orm/relations";
import { users, authenticator, feedback, session, account, products, commentLeads, postLeads } from "./schema";

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(users, {
		fields: [authenticator.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	authenticators: many(authenticator),
	feedbacks: many(feedback),
	sessions: many(session),
	accounts: many(account),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	user: one(users, {
		fields: [feedback.userId],
		references: [users.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

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