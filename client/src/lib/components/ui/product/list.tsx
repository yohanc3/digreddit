'use client'
import { products } from '@/db/schema';
import { UseProducts } from '@/lib/frontend/hooks/useProducts';
import { Products } from '@/types/backend/db';
import ProductCard from './card';
import LoadingProductCard from './loadingCard';
export default function ProductList() {
    const { allUserProducts, isAllUserProductsIsLoading } = UseProducts()
    return (
        <>
         {  
            !isAllUserProductsIsLoading ? allUserProducts.map((product:Products) =>{
                return <ProductCard leadDetails={product}/>
            })
            : Array.from({ length: 8 }).map(()=>{
                return <LoadingProductCard />
            })
         }
        </>
    )
}