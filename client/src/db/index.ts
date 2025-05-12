import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, inArray, sql } from 'drizzle-orm';
import { commentLeads, postLeads, products } from './schema';
import { neon } from "@neondatabase/serverless"

const neonConnection = neon(process.env.DATABASE_URL!);
export const db = drizzle(neonConnection, { schema });

export const productsQueries = {
    getAllProductsByUserID: async (userID: string) => {
        return await db
            .select()
            .from(products)
            .where(eq(products.userId, userID));
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

        return results[0]
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

        const allSortedLeads = [...allPostLeads, ...allCommentLeads].sort((a, b) => {
            const firstDate = new Date(a.createdAt)
            const secondDate = new Date(b.createdAt)

            return firstDate.getTime() - secondDate.getTime()
        })

        return allSortedLeads;
    },
};
