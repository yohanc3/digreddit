import { useQuery } from "@tanstack/react-query";
import { UseFetch } from "./useFetch";

export function UseProducts() {
    const {apiGet} = UseFetch()
    const { data: allUserProducts, isLoading: isAllUserProductsIsLoading } = useQuery({
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
        isAllUserProductsIsLoading
    }
}