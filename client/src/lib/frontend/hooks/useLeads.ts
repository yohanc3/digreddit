import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'next/navigation';

export function useLeads(
    selectedProduct: Products | null,
    selectedBookmark?: string,
    options?: LeadOptions,
    page: number = 0,
    selectedCollection?: string
): {
    leads: CommentLead[] | PostLead[] | null;
    totalCount: number;
    isLoading: boolean;
    isRefetching: boolean;
    isFetching: boolean;
    refetchAllLeads: () => void;
} {
    // Debounce the options to prevent excessive API calls
    const [debouncedOptions] = useDebounce(options, 1500);
    const { apiPost } = useFetch();
    const search = useSearchParams();

    const {
        data: result,
        isLoading,
        refetch: refetchAllLeads,
        isRefetching,
        isFetching,
    } = useQuery({
        queryKey: [
            'allLeads',
            selectedProduct?.id,
            selectedBookmark,
            selectedCollection,
            page,
            debouncedOptions,
        ],
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
                          bookmarkID: selectedBookmark,
                          collectionID: selectedCollection,
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

    if (!result)
        return {
            leads: null,
            totalCount: 0,
            isLoading,
            isRefetching,
            isFetching,
            refetchAllLeads,
        };

    // No need for client-side filtering anymore since it's done in the backend
    return {
        leads: result.allLeads as CommentLead[] | PostLead[] | null,
        totalCount: result.totalCount,
        refetchAllLeads,
        isLoading,
        isRefetching,
        isFetching,
    };
}
