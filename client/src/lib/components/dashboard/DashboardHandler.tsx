'use client';

import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { useState } from 'react';
import {
    LeftSideBarLeadResult,
    RightSideBarLeadResult,
} from '../ui/lead/sidebar';
import RedditLeadCard from '../ui/lead/card';
import { useQuery } from '@tanstack/react-query';
import ProductConfig from '../ui/lead/productConfig';

export default function DashboardHandler({
    fetchedProducts,
}: {
    fetchedProducts: Products[];
}) {
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(
        fetchedProducts[0]
    );

    console.log('current product id: ', selectedProduct?.id);

    const { data: result, isLoading } = useQuery({
        queryKey: ['allLeads', selectedProduct?.id],
        queryFn: async () => {
            if (!selectedProduct) return { allLeads: null };

            try {
                const result = await fetch('/api/leads', {
                    method: 'POST',
                    body: JSON.stringify({
                        productID: selectedProduct.id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const allLeads = await result.json();

                return allLeads;
            } catch (e) {
                console.error(
                    'Error when fetching all leads from product id: ',
                    selectedProduct.id,
                    '. Error: ',
                    e
                );
                return [];
            }
        },
    });

    function onSelectedProductChange(index: number) {
        setSelectedProduct(fetchedProducts[index]);
    }

    console.log('all leads: ', result?.allLeads);

    return (
        <>
            <LeftSideBarLeadResult
                products={fetchedProducts}
                onSelectedProductChange={onSelectedProductChange}
            />

            <div className="w-2/3">
                <ProductConfig />
                <div className="px-4 font-semibold text-primarySize text-secondaryColor">
                    Lead List:
                </div>
                <div className="w-full p-4 pt-1 justify-center grid grid-cols-3 gap-2">
                    {!result?.allLeads ? (
                        <> No leads at the moment!</>
                    ) : (
                        (result.allLeads as (CommentLead[] | PostLead[])).map((lead) => {
                            return <>{lead === CommentLead}</>
                        })
                    )}
                </div>
            </div>
            <RightSideBarLeadResult />
        </>
    );
}
