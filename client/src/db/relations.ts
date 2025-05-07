import { relations } from "drizzle-orm/relations";
import { products, commentLeads, postLeads, users } from "./schema";

export const commentLeadsRelations = relations(commentLeads, ({one}) => ({
	product: one(products, {
		fields: [commentLeads.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	commentLeads: many(commentLeads),
	postLeads: many(postLeads),
	user: one(users, {
		fields: [products.userId],
		references: [users.id]
	}),
}));

export const postLeadsRelations = relations(postLeads, ({one}) => ({
	product: one(products, {
		fields: [postLeads.productId],
		references: [products.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	products: many(products),
}));