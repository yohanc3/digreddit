import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq, asc, desc, gte, and, inArray } from 'drizzle-orm';
import {
    bookmarks,
    collections,
    commentLeads,
    feedback,
    nonBetaUsers,
    postLeads,
    products,
    users,
} from './schema';
import { Payload, Products, LeadFilters, LeadStage } from '@/types/backend/db';

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
        keywords: string[],
        criteria?: string
    ) => {
        const [updatedProduct] = await db
            .update(products)
            .set({
                title,
                description,
                keywords,
                criteria: criteria || '',
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
        pagesOffset: number = 0,
        filters?: LeadFilters
    ) => {
        const limit = Math.floor(PAGINATION_LIMIT / 2); // 15 for each type
        const offset = pagesOffset * limit;

        // Get collection subreddits if collectionID is provided
        let collectionSubreddits: string[] = [];
        if (filters?.collectionID) {
            const collection = await db
                .select({ subreddits: collections.subreddits })
                .from(collections)
                .where(eq(collections.id, filters.collectionID))
                .limit(1);

            if (collection[0]?.subreddits) {
                collectionSubreddits = (
                    collection[0].subreddits as string[]
                ).map((subreddit: string) => 'r/' + subreddit);
            }
        }

        // Build where conditions
        const buildWhereConditions = (
            table: typeof postLeads | typeof commentLeads
        ) => {
            const conditions = [eq(table.productID, productID)];

            if (filters?.minRating) {
                conditions.push(gte(table.rating, filters.minRating));
            }

            if (filters?.showOnlyUninteracted) {
                conditions.push(eq(table.isInteracted, false));
            }

            if (filters?.stage) {
                conditions.push(eq(table.stage, filters.stage));
            }

            if (filters?.bookmarkID) {
                conditions.push(eq(table.bookmarkID, filters.bookmarkID));
            }

            if (filters?.collectionID && collectionSubreddits.length > 0) {
                conditions.push(inArray(table.subreddit, collectionSubreddits));
            }

            return and(...conditions);
        };

        // Build order by clause
        const getOrderBy = (table: typeof postLeads | typeof commentLeads) => {
            switch (filters?.sortingMethod) {
                case 'newest':
                    return desc(table.createdAt);
                case 'oldest':
                    return asc(table.createdAt);
                case 'most-upvotes':
                    return desc(table.ups);
                case 'least-upvotes':
                    return asc(table.ups);
                default:
                    return desc(table.createdAt);
            }
        };

        const allPostLeads = await db
            .select()
            .from(postLeads)
            .where(buildWhereConditions(postLeads))
            .orderBy(getOrderBy(postLeads))
            .limit(limit)
            .offset(offset);

        const allCommentLeads = await db
            .select()
            .from(commentLeads)
            .where(buildWhereConditions(commentLeads))
            .orderBy(getOrderBy(commentLeads))
            .limit(limit)
            .offset(offset);

        // Combine and sort the resultsd
        const allSortedLeads = [...allPostLeads, ...allCommentLeads].sort(
            (a, b) => {
                switch (filters?.sortingMethod) {
                    case 'newest':
                        return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    case 'oldest':
                        return (
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        );
                    case 'most-upvotes':
                        return b.ups - a.ups;
                    case 'least-upvotes':
                        return a.ups - b.ups;
                    default:
                        return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                }
            }
        );

        return allSortedLeads;
    },
    getTotalLeadsCountByProductID: async (
        productID: string,
        filters?: LeadFilters
    ) => {
        // Get collection subreddits if collectionID is provided
        let collectionSubreddits: string[] = [];
        if (filters?.collectionID) {
            const collection = await db
                .select({ subreddits: collections.subreddits })
                .from(collections)
                .where(eq(collections.id, filters.collectionID))
                .limit(1);

            if (collection[0]?.subreddits) {
                collectionSubreddits = (
                    collection[0].subreddits as string[]
                ).map((subreddit: string) => 'r/' + subreddit);
            }
        }

        // Build where conditions for counting
        const buildWhereConditions = (
            table: typeof postLeads | typeof commentLeads
        ) => {
            const conditions = [eq(table.productID, productID)];

            if (filters?.minRating) {
                conditions.push(gte(table.rating, filters.minRating));
            }

            if (filters?.showOnlyUninteracted) {
                conditions.push(eq(table.isInteracted, false));
            }

            if (filters?.stage) {
                conditions.push(eq(table.stage, filters.stage));
            }

            if (filters?.bookmarkID) {
                conditions.push(eq(table.bookmarkID, filters.bookmarkID));
            }

            if (filters?.collectionID && collectionSubreddits.length > 0) {
                conditions.push(inArray(table.subreddit, collectionSubreddits));
            }

            return and(...conditions);
        };

        const [postLeadsCount] = await db
            .select({ value: count() })
            .from(postLeads)
            .where(buildWhereConditions(postLeads));

        const [commentLeadsCount] = await db
            .select({ value: count() })
            .from(commentLeads)
            .where(buildWhereConditions(commentLeads));

        return (postLeadsCount?.value || 0) + (commentLeadsCount?.value || 0);
    },

    updateLeadStage: async (
        leadID: string,
        stage: LeadStage,
        isPost: boolean
    ) => {
        const [updatedLead] = await db
            .update(isPost ? postLeads : commentLeads)
            .set({ stage })
            .where(eq(isPost ? postLeads.id : commentLeads.id, leadID))
            .returning();

        return updatedLead;
    },
};

export const bookmarkQueries = {
    updateBookmark: async (
        bookmarkID: string,
        title: string,
        description: string,
        userID: string
    ) => {
        const [udpatedBookmark] = await db
            .update(bookmarks)
            .set({ title, description })
            .where(
                and(eq(bookmarks.id, bookmarkID), eq(bookmarks.userID, userID))
            )
            .returning();

        return udpatedBookmark;
    },
    createBookmark: async (
        productID: string,
        title: string,
        description: string,
        userID: string
    ) => {
        const [createdBookmark] = await db
            .insert(bookmarks)
            .values({
                title: title,
                description: description,
                userID: userID,
                productID: productID,
            })
            .returning();

        return createdBookmark;
    },
    deleteBookmark: async (bookmarkID: string, userID: string) => {
        const [deletedBookmark] = await db
            .delete(bookmarks)
            .where(
                and(eq(bookmarks.id, bookmarkID), eq(bookmarks.userID, userID))
            )
            .returning();

        return deletedBookmark;
    },
    getProductBookmarks: async (productID: string) => {
        return await db
            .select()
            .from(bookmarks)
            .where(eq(bookmarks.productID, productID));
    },
    getUserBookmarks: async (userID: string) => {
        const rows = await db
            .select({
                bookmarkId: bookmarks.id,
                bookmarkTitle: bookmarks.title,
                bookmarkDescription: bookmarks.description,
                bookmarkCreatedAt: bookmarks.createdAt,
                bookmarkUpdatedAt: bookmarks.updatedAt,
                productId: products.id,
                productTitle: products.title,
            })
            .from(bookmarks)
            .innerJoin(products, eq(bookmarks.productID, products.id))
            .where(eq(bookmarks.userID, userID));

        // Group bookmarks by product
        const groupedByProduct: Record<
            string,
            {
                productId: string;
                productTitle: string;
                bookmarks: Array<{
                    id: string;
                    title: string;
                    description: string;
                    createdAt: string;
                    updatedAt: string;
                }>;
            }
        > = {};

        for (const row of rows) {
            if (!groupedByProduct[row.productId]) {
                groupedByProduct[row.productId] = {
                    productId: row.productId,
                    productTitle: row.productTitle,
                    bookmarks: [],
                };
            }

            groupedByProduct[row.productId].bookmarks.push({
                id: row.bookmarkId,
                title: row.bookmarkTitle,
                description: row.bookmarkDescription,
                createdAt: row.bookmarkCreatedAt,
                updatedAt: row.bookmarkUpdatedAt,
            });
        }

        return Object.values(groupedByProduct);
    },
    addBookmarkToLead: async (
        leadID: string,
        bookmarkID: string,
        isPost: boolean
    ) => {
        const [updatedLead] = await db
            .update(isPost ? postLeads : commentLeads)
            .set({ bookmarkID })
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

export const userQueries = {
    addRedditRefreshToken: async (token: string, userID: string) => {
        const [updatedUser] = await db
            .update(users)
            .set({
                redditRefreshToken: token,
            })
            .where(eq(users.id, userID))
            .returning();
        return updatedUser;
    },
    checkRedditConnection: async (userID: string) => {
        const refreshToken = await userQueries.getRedditRefreshToken(userID);

        return refreshToken ? true : false;
    },
    getRedditRefreshToken: async (userID: string) => {
        const result = await db
            .select({
                redditRefreshToken: users.redditRefreshToken,
            })
            .from(users)
            .where(eq(users.id, userID));

        const { redditRefreshToken } = result[0];

        if (redditRefreshToken) {
            return redditRefreshToken;
        } else {
            return null;
        }
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

export const collectionQueries = {
    updateCollection: async (
        collectionID: string,
        title: string,
        description: string,
        subreddits: string[],
        userID: string
    ) => {
        const [updatedCollection] = await db
            .update(collections)
            .set({
                title,
                description,
                subreddits: subreddits as any,
                updatedAt: new Date().toISOString(),
            })
            .where(
                and(
                    eq(collections.id, collectionID),
                    eq(collections.userID, userID)
                )
            )
            .returning();

        return updatedCollection;
    },
    createCollection: async (
        productID: string,
        title: string,
        description: string,
        subreddits: string[],
        userID: string
    ) => {
        const [createdCollection] = await db
            .insert(collections)
            .values({
                title: title,
                description: description,
                subreddits: subreddits as any,
                userID: userID,
                productID: productID,
            })
            .returning();

        return createdCollection;
    },
    deleteCollection: async (collectionID: string, userID: string) => {
        const [deletedCollection] = await db
            .delete(collections)
            .where(
                and(
                    eq(collections.id, collectionID),
                    eq(collections.userID, userID)
                )
            )
            .returning();

        return deletedCollection;
    },
    getProductCollections: async (productID: string) => {
        return await db
            .select()
            .from(collections)
            .where(eq(collections.productID, productID));
    },
    getUserCollections: async (userID: string) => {
        const rows = await db
            .select({
                collectionId: collections.id,
                collectionTitle: collections.title,
                collectionDescription: collections.description,
                collectionSubreddits: collections.subreddits,
                collectionCreatedAt: collections.createdAt,
                collectionUpdatedAt: collections.updatedAt,
                productId: products.id,
                productTitle: products.title,
            })
            .from(collections)
            .innerJoin(products, eq(collections.productID, products.id))
            .where(eq(collections.userID, userID));

        // Group collections by product
        const groupedByProduct: Record<
            string,
            {
                productId: string;
                productTitle: string;
                collections: Array<{
                    id: string;
                    title: string;
                    description: string;
                    subreddits: string[];
                    createdAt: string;
                    updatedAt: string;
                }>;
            }
        > = {};

        for (const row of rows) {
            if (!groupedByProduct[row.productId]) {
                groupedByProduct[row.productId] = {
                    productId: row.productId,
                    productTitle: row.productTitle,
                    collections: [],
                };
            }

            groupedByProduct[row.productId].collections.push({
                id: row.collectionId,
                title: row.collectionTitle,
                description: row.collectionDescription,
                subreddits: row.collectionSubreddits as string[],
                createdAt: row.collectionCreatedAt,
                updatedAt: row.collectionUpdatedAt,
            });
        }

        return Object.values(groupedByProduct);
    },
};
