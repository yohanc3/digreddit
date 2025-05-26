import { useQuery } from "@tanstack/react-query";
import { useFetch } from "./useFetch";
import { toast } from '@/hooks/use-toast';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';

export function useProducts() {
    const {apiGet} = useFetch()
    const { data: allUserProducts, isLoading: isAllUserProductsLoading } = useQuery({
        queryKey: ['allUserProducts'],
        queryFn: async () => {
            try {
                const result = await apiGet('api/products');

                return result.userProducts;
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: 'Error',
                    description: 'Something went wrong when fetching your Products List.'
                });
                console.error(
                    'Error when fetching user Products',
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