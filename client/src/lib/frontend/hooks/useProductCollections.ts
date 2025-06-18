import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Collection } from '@/types/backend/db';

export function useProductCollections(productID?: string) {
    const { apiPost } = useFetch();

    const {
        data: result,
        isLoading: isCollectionsLoading,
        refetch: refetchAllCollections,
    } = useQuery({
        queryKey: ['productCollections', productID || ''],
        queryFn: async () => {
            try {
                const result = await apiPost('api/product/collection/read', {
                    productID: productID,
                });

                return {
                    collections: result.collections || [],
                };
            } catch (e) {
                console.error(
                    'Error when fetching all collections from product id: ',
                    productID,
                    '. Error: ',
                    e
                );
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
        collections: result.collections as Collection[] | null,
        refetchAllCollections,
        isCollectionsLoading,
    };
}
