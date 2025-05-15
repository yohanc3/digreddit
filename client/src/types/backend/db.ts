import { commentLeads, postLeads, products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type PostLead = InferSelectModel<typeof postLeads>;

export type CommentLead = InferSelectModel<typeof commentLeads>;

export type Products = InferSelectModel<typeof products>;

//CRUD Function Parameter Types
export type Payload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;