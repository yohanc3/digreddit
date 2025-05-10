import ProductCard from '@/lib/components/ui/product/card';

export default async function Dashboard() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-primaryColor mb-6">
                Your Products
            </h1>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
