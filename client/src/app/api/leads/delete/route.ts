import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import { sub, format } from 'date-fns';

import { auth } from '../../../../../auth';
import { db } from '@/db';
import { commentLeads, postLeads, collections } from '@/db/schema';
import { LeadFilters } from '@/types/backend/db';

/*
    Deletes all leads given a productID and filters
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { productID, filters }: { productID: string; filters: LeadFilters } =
        body;

    if (!productID) {
        return NextResponse.json(
            { error: 'productID is required.' },
            { status: 400 }
        );
    }

    try {
        // Get collection subreddits if filtering by collection
        const collectionSubreddits = await getCollectionSubreddits(
            filters?.collectionID
        );

        // Build where conditions for both post and comment leads
        const postLeadsWhere = buildWhereConditions(
            postLeads,
            productID,
            filters,
            collectionSubreddits
        );
        const commentLeadsWhere = buildWhereConditions(
            commentLeads,
            productID,
            filters,
            collectionSubreddits
        );

        // Delete post leads if conditions exist
        if (postLeadsWhere) {
            await db.delete(postLeads).where(postLeadsWhere);
        }

        // Delete comment leads if conditions exist
        if (commentLeadsWhere) {
            await db.delete(commentLeads).where(commentLeadsWhere);
        }

        return NextResponse.json(
            { message: 'Leads deleted successfully.' },
            { status: 200 }
        );
    } catch (e) {
        console.error(
            'Error when deleting leads from product id: ',
            productID,
            '. Error: ',
            e
        );
        return NextResponse.json(
            {
                error:
                    'Error when deleting leads from product id: ' +
                    productID +
                    '. Error: ' +
                    e,
            },
            { status: 500 }
        );
    }
});

// Helper Functions

/**
 * Retrieves subreddits for a given collection ID
 */
async function getCollectionSubreddits(
    collectionID?: string
): Promise<string[]> {
    if (!collectionID) return [];

    try {
        const collection = await db
            .select({ subreddits: collections.subreddits })
            .from(collections)
            .where(eq(collections.id, collectionID))
            .limit(1);

        if (collection[0]?.subreddits) {
            return (collection[0].subreddits as string[]).map(
                (subreddit: string) => 'r/' + subreddit
            );
        }
    } catch (error) {
        console.error('Error fetching collection subreddits:', error);
    }

    return [];
}

/**
 * Builds where conditions for lead deletion based on filters
 */
function buildWhereConditions(
    table: typeof postLeads | typeof commentLeads,
    productID: string,
    filters: LeadFilters,
    collectionSubreddits: string[]
) {
    const conditions = [eq(table.productID, productID)];

    // Filter by maximum rating
    if (filters?.maxRating) {
        conditions.push(lte(table.rating, filters.maxRating));
    }

    // Filter by interaction status
    if (filters?.showOnlyUninteracted) {
        conditions.push(eq(table.isInteracted, false));
    }

    // Filter by stage
    if (filters?.stage) {
        conditions.push(eq(table.stage, filters.stage));
    }

    // Filter by bookmark
    if (filters?.bookmarkID) {
        conditions.push(eq(table.bookmarkID, filters.bookmarkID));
    }

    // Filter by collection subreddits
    if (filters?.collectionID && collectionSubreddits.length > 0) {
        conditions.push(inArray(table.subreddit, collectionSubreddits));
    }

    // Filter by age (older than specified days)
    if (filters?.maxAgeDays) {
        const cutoffDate = sub(new Date(), { days: filters.maxAgeDays });
        conditions.push(lte(table.createdAt, cutoffDate.toISOString()));
    }

    return and(...conditions);
}
