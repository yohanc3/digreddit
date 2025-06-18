'use client';

import { BiCollection } from 'react-icons/bi';
import { useUserCollections } from '@/lib/frontend/hooks/useUserCollections';
import CollectionList from '@/lib/components/ui/collection/collectionList';

interface UserCollectionsByProduct {
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
}

export default function Collections() {
    const { collections: productList, isCollectionsLoading } =
        useUserCollections();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-row space-x-1 items-center text-primaryColor mb-6">
                <BiCollection className="font-semibold" size={36} />
                <div className="text-xl md:text-3xl font-semibold">
                    Your Collections
                </div>
            </div>
            <div className="w-full flex flex-col gap-y-6">
                {!isCollectionsLoading &&
                    productList &&
                    productList?.length > 0 &&
                    productList.map((product: any, index: number) => {
                        return (
                            <CollectionList
                                key={index}
                                collectionList={product}
                            />
                        );
                    })}
                {!isCollectionsLoading &&
                    (!productList || productList?.length === 0) && (
                        <div className="text-center text-gray-500 py-12">
                            <BiCollection
                                size={64}
                                className="mx-auto mb-4 text-gray-300"
                            />
                            <p className="text-lg">No collections yet</p>
                            <p className="text-sm">
                                Create collections from your dashboard to
                                organize leads by subreddits.
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}
