import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';

export function useLeads(
    selectedProduct: Products | null,
    options?: LeadOptions
): {
    leads: CommentLead[] | PostLead[] | null;
    isLoading: boolean;
} {
    if (!selectedProduct) return { leads: null, isLoading: false };

    const { data: result, isLoading } = useQuery({
        queryKey: ['allLeads', selectedProduct?.id],
        queryFn: async () => {
            if (!selectedProduct) return { allLeads: null };

            try {
                const result = await fetch('/api/leads', {
                    method: 'POST',
                    body: JSON.stringify({
                        productID: selectedProduct.id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch leads');
                }

                const allLeads = await result.json();

                if (!allLeads.allLeads) return null;

                return allLeads.allLeads;
            } catch (e) {
                console.error(
                    'Error when fetching all leads from product id: ',
                    selectedProduct.id,
                    '. Error: ',
                    e
                );
                return [];
            }
        },
        staleTime: 0,
    });

    if (!result) return { leads: null, isLoading };

    let leadsCopy = [...result] as CommentLead[] | PostLead[];

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
        isLoading,
    };
}
