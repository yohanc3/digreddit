import { pgTable, uuid, text, smallint, timestamp, boolean, integer, jsonb, foreignKey } from "drizzle-orm/pg-core"

export const commentLeads = pgTable("CommentLeads", {
	id: uuid().defaultRandom().notNull(),
	subreddit: text().notNull(),
	author: text().notNull(),
	body: text().notNull(),
	url: text().notNull(),
	ups: smallint().notNull(),
	downs: smallint().notNull(),
	productId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	rating: smallint().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "fk_product"
		}),
]);

export const postLeads = pgTable("PostLeads", {
	id: uuid().defaultRandom().notNull(),
	subreddit: text().notNull(),
	title: text().notNull(),
	author: text().notNull(),
	body: text().notNull(),
	url: text().notNull(),
	numComments: smallint().notNull(),
	subredditSubscribers: smallint(),
	over18: boolean().notNull(),
	ups: smallint().notNull(),
	downs: smallint().notNull(),
	productId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	rating: smallint().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "fk_product"
		}),
]);

export const products = pgTable("Products", {
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
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_user"
		}),
]);

export const users = pgTable("Users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	profilePicture: text("profile_picture"),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});
