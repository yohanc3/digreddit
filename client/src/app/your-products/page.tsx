import ProductCard from '@/lib/components/ui/product/card';

export default async function Dashboard() {
    return (
        <div className="w-5/6">
            <div className="text-[3rem] font-semibold text-secondaryColor">
                Your Products
            </div>
            <div className="w-full justify-center grid grid-cols-3 gap-2">
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
        </div>
    );
}
