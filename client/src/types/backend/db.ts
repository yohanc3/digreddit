import { commentLeads, postLeads, products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type PostLead = InferSelectModel<typeof postLeads>;

export type CommentLead = InferSelectModel<typeof commentLeads>;

export type Products = InferSelectModel<typeof products>;

//CRUD Function Parameter Types
export type Payload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Lead stage type
export type LeadStage = 'identification' | 'initial_outreach' | 'engagement';

// Lead Filters Interface
export interface LeadFilters {
    minRating?: number;
    sortingMethod?: 'newest' | 'oldest' | 'most-upvotes' | 'least-upvotes';
    showOnlyUninteracted?: boolean;
    stage?: LeadStage;
}
