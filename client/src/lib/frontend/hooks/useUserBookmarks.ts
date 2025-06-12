import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Bookmark, CommentLead, PostLead, Products } from '@/types/backend/db';

export function useUserBookmarks() {
    const { apiPost } = useFetch();
    const {
        data: result,
        isLoading: isBookmarksLoading,
        refetch: refetchAllBookmarks,
    } = useQuery({
        queryKey: ['userBookmarks'],
        queryFn: async () => {

            try {
                const result = await apiPost('api/product/bookmark/read', {});

                return {
                    bookmarks: result.bookmarks || []
                };
            } catch (e) {
                console.error(
                    'Error when fetching all bookmarks from user: ',
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
        bookmarks: result.bookmarks as {
            productId: string;
            productTitle: string;
            bookmarks: Array<{
                id: string;
                title: string;
                description: string;
                createdAt: string;
                updatedAt: string;
            }>
        }[] | null,
        refetchAllBookmarks,
        isBookmarksLoading,
    };
}
