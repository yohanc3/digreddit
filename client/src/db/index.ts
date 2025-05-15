import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { commentLeads, postLeads, products } from './schema';
import { Payload, Products } from '@/types/backend/db';
// import { neon } from "@neondatabase/serverless"

export const db = drizzle(process.env.DATABASE_URL!, { schema });

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

    createProduct: async (payload: Payload<Products>) => {
        const [createdProduct] = await db
            .insert(products)
            .values(payload)
            .returning();

        return createdProduct;
    },

    updateProductByID: async (
        productID: string,
        title: string,
        description: string,
        keywords: string[]
    ) => {
        await db
            .update(products)
            .set({ title, description, keywords })
            .where(eq(products.id, productID));
    },
};

export const leadsQueries = {
    getAllLeadsByProductID: async (productID: string) => {
        const allPostLeads = await db.query.postLeads.findMany({
            where: eq(postLeads.productId, productID),
        });

        const allCommentLeads = await db.query.commentLeads.findMany({
            where: eq(commentLeads.productId, productID),
        });

        const allSortedLeads = [...allPostLeads, ...allCommentLeads].sort(
            (a, b) => {
                const firstDate = new Date(a.createdAt);
                const secondDate = new Date(b.createdAt);

                return firstDate.getTime() - secondDate.getTime();
            }
        );

        return allSortedLeads;
    },
};
