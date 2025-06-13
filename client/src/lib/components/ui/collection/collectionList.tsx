import clsx from 'clsx';
import CollectionPageCard from '@/lib/components/ui/collection/collectionPageCard';

interface CollectionListProps {
    className?: string;
    collectionList: {
        productId: string;
        productTitle: string;
        collections: {
            id: string;
            title: string;
            description: string;
            subreddits: string[];
            createdAt: string;
            updatedAt: string;
        }[];
    };
}

export default function CollectionList({
    className,
    collectionList,
}: CollectionListProps) {
    return (
        <div
            className={clsx(
                className,
                'w-full flex flex-col text-black px-3 py-2 rounded-lg transition-all duration-200 ease-in-out'
            )}
        >
            <div>
                <div className="font-semibold text-lg !text-primaryColor">
                    {collectionList.productTitle} Collections
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {collectionList.collections.map((collection) => {
                    return (
                        <CollectionPageCard
                            key={collection.id}
                            productID={collectionList.productId}
                            collection={collection}
                        />
                    );
                })}
            </div>
        </div>
    );
}
