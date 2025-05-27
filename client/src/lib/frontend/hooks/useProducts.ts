import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Products } from '@/types/backend/db';

export function useProducts() {
    const { apiGet } = useFetch();
    const { data: allUserProducts, isLoading: isAllUserProductsLoading } =
        useQuery({
            queryKey: ['allUserProducts'],
            queryFn: async () => {
                try {
                    const result = await apiGet('api/products');

                    return result.userProducts as Products[];
                } catch (e) {
                    console.error('Error when fetching all user Products', e);
                    return [] as Products[];
                }
            },
        });

    return {
        allUserProducts,
        isAllUserProductsLoading,
    };
}
