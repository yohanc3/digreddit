import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';

export function useLeads(
    selectedProduct: Products | null,
    options?: LeadOptions,
    page: number = 0
): {
    leads: CommentLead[] | PostLead[] | null;
    totalCount: number;
    isLoading: boolean;
} {
    const { data: result, isLoading } = useQuery({
        queryKey: ['allLeads', selectedProduct?.id, page],
        queryFn: async () => {
            if (!selectedProduct) return { allLeads: [], totalCount: 0 };

            try {
                const result = await fetch('/api/leads', {
                    method: 'POST',
                    body: JSON.stringify({
                        productID: selectedProduct.id,
                        pagesOffset: page,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch leads');
                }

                const data = await result.json();

                return {
                    allLeads: data.allLeads || [],
                    totalCount: data.totalCount || 0,
                };
            } catch (e) {
                console.error(
                    'Error when fetching all leads from product id: ',
                    selectedProduct.id,
                    '. Error: ',
                    e
                );
                return { allLeads: [], totalCount: 0 };
            }
        },
        staleTime: 0,
    });

    if (!result) return { leads: null, totalCount: 0, isLoading };

    let leadsCopy = [...result.allLeads] as CommentLead[] | PostLead[];

    if (options?.minRating) {
        leadsCopy = leadsCopy.filter(
            (lead) => lead.rating >= options.minRating
        );
    }

    if (options?.sortingMethod) {
        leadsCopy = leadsCopy.sort(
            (a: CommentLead | PostLead, b: CommentLead | PostLead) => {
                if (options.sortingMethod === 'newest') {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return bDate.getTime() - aDate.getTime();
                }
                if (options.sortingMethod === 'oldest') {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return aDate.getTime() - bDate.getTime();
                }
                if (options.sortingMethod === 'most-upvotes') {
                    return b.ups - a.ups;
                }
                if (options.sortingMethod === 'least-upvotes') {
                    return a.ups - b.ups;
                }
                return 0;
            }
        );
    }

    if (options?.showOnlyUninteracted) {
        leadsCopy = leadsCopy.filter((lead) => !lead.isInteracted);
    }

    return {
        leads: leadsCopy as CommentLead[] | PostLead[] | null,
        totalCount: result.totalCount,
        isLoading,
    };
}
