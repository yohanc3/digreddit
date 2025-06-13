import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Collection } from '@/types/backend/db';

interface UserCollectionsByProduct {
    productId: string;
    productTitle: string;
    collections: Collection[];
}

export function useUserCollections() {
    const { apiPost } = useFetch();

    const {
        data: result,
        isLoading: isCollectionsLoading,
        refetch: refetchAllCollections,
    } = useQuery({
        queryKey: ['userCollections'],
        queryFn: async () => {
            try {
                const result = await apiPost('api/user/collections', {});
                return {
                    collections: result.collections || [],
                };
            } catch (e) {
                console.error('Error when fetching user collections: ', e);
                return { collections: [] };
            }
        },
    });

    if (!result?.collections)
        return {
            collections: null,
            isCollectionsLoading,
            refetchAllCollections,
        };

    return {
        collections: result.collections as UserCollectionsByProduct[] | null,
        refetchAllCollections,
        isCollectionsLoading,
    };
}
