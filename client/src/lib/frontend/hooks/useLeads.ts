import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';
import { useDebounce } from 'use-debounce';

export function useLeads(
    selectedProduct: Products | null,
    options?: LeadOptions,
    page: number = 0
): {
    leads: CommentLead[] | PostLead[] | null;
    totalCount: number;
    isLoading: boolean;
} {
    // Debounce the options to prevent excessive API calls
    const [debouncedOptions] = useDebounce(options, 1500);
    const { apiPost } = useFetch();

    const { data: result, isLoading } = useQuery({
        queryKey: ['allLeads', selectedProduct?.id, page, debouncedOptions],
        queryFn: async () => {
            if (!selectedProduct) return { allLeads: [], totalCount: 0 };

            try {
                // Prepare filters for API
                const filters = debouncedOptions
                    ? {
                          minRating: debouncedOptions.minRating,
                          sortingMethod: debouncedOptions.sortingMethod,
                          showOnlyUninteracted:
                              debouncedOptions.showOnlyUninteracted,
                          stage: debouncedOptions.stage,
                      }
                    : undefined;

                const result = await apiPost('api/leads', {
                    productID: selectedProduct.id,
                    pagesOffset: page.toString(),
                    filters,
                });

                const data = result.allLeads as
                    | CommentLead[]
                    | PostLead[]
                    | null;

                return {
                    allLeads: data || [],
                    totalCount: result.totalCount,
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
        staleTime: 30000, // Cache for 30 seconds
        enabled: !!selectedProduct, // Only run query if selectedProduct exists
    });

    if (!result) return { leads: null, totalCount: 0, isLoading };

    // No need for client-side filtering anymore since it's done in the backend
    return {
        leads: result.allLeads as CommentLead[] | PostLead[] | null,
        totalCount: result.totalCount,
        isLoading,
    };
}
