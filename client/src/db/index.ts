import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq, asc, desc } from 'drizzle-orm';
import {
    commentLeads,
    feedback,
    nonBetaUsers,
    postLeads,
    products,
} from './schema';
import { Payload, Products } from '@/types/backend/db';

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// Constants for pagination
const PAGINATION_LIMIT = 30;

export const productsQueries = {
    getAllProductsByUserID: async (userID: string) => {
        return await db
            .select()
            .from(products)
            .where(eq(products.userId, userID))
            .orderBy(products.createdAt);
    },

    getProductByUserID: async (userID: string) => {
        return await db
            .select()
            .from(products)
            .where(eq(products.userId, userID));
    },

    getProductByID: async (productID: string) => {
        const results = await db
            .select()
            .from(products)
            .where(eq(products.id, productID));

        return results[0];
    },

    updateProductByID: async (
        productID: string,
        title: string,
        description: string,
        keywords: string[]
    ) => {
        const [updatedProduct] = await db
            .update(products)
            .set({
                title,
                description,
                keywords,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(products.id, productID))
            .returning();

        return updatedProduct;
    },

    createProduct: async (payload: Payload<Products>) => {
        const [createdProduct] = await db
            .insert(products)
            .values(payload)
            .returning();

        return createdProduct;
    },

    isProductLimitReached: async (userID: string) => {
        const results = await db
            .select({ value: count() })
            .from(products)
            .where(eq(products.userId, userID));

        const data = results[0]?.value ?? 0;
        return data >= 2;
    },
};

export const leadsQueries = {
    getAllLeadsByProductID: async (
        productID: string,
        pagesOffset: number = 0
    ) => {
        const limit = Math.floor(PAGINATION_LIMIT / 2); // 15 for each type
        const offset = pagesOffset * limit;

        const allPostLeads = await db
            .select()
            .from(postLeads)
            .where(eq(postLeads.productID, productID))
            .orderBy(desc(postLeads.createdAt))
            .limit(limit)
            .offset(offset);

        const allCommentLeads = await db
            .select()
            .from(commentLeads)
            .where(eq(commentLeads.productID, productID))
            .orderBy(desc(commentLeads.createdAt))
            .limit(limit)
            .offset(offset);

        const allSortedLeads = [...allPostLeads, ...allCommentLeads].sort(
            (a, b) => {
                const firstDate = new Date(a.createdAt);
                const secondDate = new Date(b.createdAt);

                return firstDate.getTime() - secondDate.getTime();
            }
        );

        return allSortedLeads;
    },

    getTotalLeadsCountByProductID: async (productID: string) => {
        const [postLeadsCount] = await db
            .select({ value: count() })
            .from(postLeads)
            .where(eq(postLeads.productID, productID));

        const [commentLeadsCount] = await db
            .select({ value: count() })
            .from(commentLeads)
            .where(eq(commentLeads.productID, productID));

        return (postLeadsCount?.value || 0) + (commentLeadsCount?.value || 0);
    },

    updateLeadInteraction: async (
        leadID: string,
        isInteracted: boolean,
        isPost: boolean
    ) => {
        const [updatedLead] = await db
            .update(isPost ? postLeads : commentLeads)
            .set({ isInteracted })
            .where(eq(isPost ? postLeads.id : commentLeads.id, leadID))
            .returning();

        return updatedLead;
    },
};

export const nonBetaUsersQueries = {
    addNonBetaUserEmail: async (email: string) => {
        const [createdNonBetaUserEmail] = await db
            .insert(nonBetaUsers)
            .values({ email })
            .returning();

        return createdNonBetaUserEmail;
    },
};

export const feedbackQueries = {
    createFeedback: async (
        area: string,
        feedbackText: string,
        userID: string
    ) => {
        const [createdFeedback] = await db
            .insert(feedback)
            .values({ area, feedback: feedbackText, userId: userID })
            .returning();

        return createdFeedback;
    },
};
