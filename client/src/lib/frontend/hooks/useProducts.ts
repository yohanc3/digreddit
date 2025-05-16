import { useQuery } from "@tanstack/react-query";
import { useFetch } from "./useFetch";

export function useProducts() {
    const {apiGet} = useFetch()
    const { data: allUserProducts, isLoading: isAllUserProductsLoading } = useQuery({
        queryKey: ['allUserProducts'],
        queryFn: async () => {
            try {
                const result = await apiGet('api/products');

                return result.userProducts;
            } catch (e) {
                console.error(
                    'Error when fetching all user Products',
                    e
                );
                return [];
            }
        },
    });

    return {
        allUserProducts,
        isAllUserProductsLoading
    }
}