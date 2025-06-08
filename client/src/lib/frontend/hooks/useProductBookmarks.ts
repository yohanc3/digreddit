import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Bookmark, CommentLead, PostLead, Products } from '@/types/backend/db';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';
import { useDebounce } from 'use-debounce';

export function useProductBookmarks(
    productID?: string,
) {
    const { apiPost } = useFetch();

    const {
        data: result,
        isLoading: isBookmarksLoading,
        refetch: refetchAllBookmarks,
    } = useQuery({
        queryKey: ['productBookmarks', productID || ""],
        queryFn: async () => {

            try {
                const result = await apiPost('api/product/bookmark/read', {
                    productID: productID,
                });

                return {
                    bookmarks: result.bookmarks || []
                };
            } catch (e) {
                console.error(
                    'Error when fetching all bookmarks from product id: ',
                    productID,
                    '. Error: ',
                    e
                );
                return { bookmarks: [] };
            }
        }
    });

    if (!result?.bookmarks)
        return { bookmarks: null, isBookmarksLoading, refetchAllBookmarks };

    return {
        bookmarks: result.bookmarks as Bookmark[] | null,
        refetchAllBookmarks,
        isBookmarksLoading,
    };
}
