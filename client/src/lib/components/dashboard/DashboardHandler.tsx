'use client';

import { CommentLead, PostLead, Products } from '@/types/backend/db';
import { useEffect, useState } from 'react';
import {
    LeftSideBarLeadResult,
    RightSideBarLeadResult,
} from '../ui/lead/sidebar';
import { RedditCommentLeadCard, RedditPostLeadCard } from '../ui/lead/card';
import ProductConfig from '../ui/lead/productConfig';
import { isPostLead } from '@/util/utils';
import { useLeads } from '@/lib/frontend/hooks/useLeads';
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { useFetch } from '@/lib/frontend/hooks/useFetch';

const sortingMethods = [
    {
        value: 'newest',
        label: 'Newest',
    },
    {
        value: 'oldest',
        label: 'Oldest',
    },
    {
        value: 'most-upvotes',
        label: 'Most Upvotes',
    },
    {
        value: 'least-upvotes',
        label: 'Least Upvotes',
    },
];

export interface LeadOptions {
    minRating: 5 | 6 | 7 | 8 | 9 | 10;
    sortingMethod: 'newest' | 'oldest' | 'most-upvotes' | 'least-upvotes';
    showOnlyUninteracted: boolean;
}

export default function DashboardHandler({
    fetchedProducts,
}: {
    fetchedProducts: Products[];
}) {
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(
        fetchedProducts[0]
    );

    const [options, setOptions] = useState<LeadOptions>({
        minRating: 5,
        sortingMethod: 'newest',
        showOnlyUninteracted: false,
    });

    const { leads, isLoading } = useLeads(selectedProduct, options);

    function onSelectedProductChange(index: number) {
        setSelectedProduct(fetchedProducts[index]);
    }

    return (
        <>
            <LeftSideBarLeadResult
                products={fetchedProducts}
                onSelectedProductChange={onSelectedProductChange}
            />

            <div className="w-2/3">
                <ProductConfig
                    productDetails={selectedProduct}
                    className="border-b border-light"
                />
                <div className="flex border-b border-light">
                    <div className="flex flex-col p-4 gap-y-2 justify-center border-r border-light w-1/3">
                        <Label className="text-primarySize">
                            Minimum lead rating
                        </Label>
                        <Input
                            type="number"
                            min={5}
                            max={10}
                            defaultValue={5}
                            step={1}
                            className="w-24"
                            onChange={(e) => {
                                setOptions({
                                    ...options,
                                    minRating: parseInt(e.target.value) as
                                        | 5
                                        | 6
                                        | 7
                                        | 8
                                        | 9
                                        | 10,
                                });
                            }}
                        />
                    </div>
                    <div className="flex flex-col p-4 gap-y-2 justify-center border-r border-light w-1/4">
                        <Label className="text-primarySize">
                            Sorting method
                        </Label>

                        <Select
                            defaultValue={sortingMethods[0].value}
                            onValueChange={(value) => {
                                setOptions({
                                    ...options,
                                    sortingMethod: value as
                                        | 'newest'
                                        | 'oldest'
                                        | 'most-upvotes'
                                        | 'least-upvotes',
                                });
                            }}
                        >
                            <SelectContent>
                                {sortingMethods.map((method) => (
                                    <SelectItem
                                        key={method.value}
                                        value={method.value}
                                    >
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sorting method" />
                            </SelectTrigger>
                        </Select>
                    </div>
                    <div className="flex flex-col px-4 gap-y-2 justify-center border-r border-light">
                        <div className="flex items-center gap-x-2">
                            <Checkbox
                                checked={options.showOnlyUninteracted}
                                onCheckedChange={() => {
                                    setOptions({
                                        ...options,
                                        showOnlyUninteracted:
                                            !options.showOnlyUninteracted,
                                    });
                                }}
                            />
                            <Label className="text-primarySize">
                                Show only leads you have not interacted with
                            </Label>
                        </div>
                        <Label className="text-xs text-muted-foreground ">
                            To interact with a lead, simply open the original
                            comment/post through the "Open" or "View Comment"
                            button.
                        </Label>
                    </div>
                </div>

                <div className="p-4 font-semibold text-primarySize text-secondaryColor">
                    Lead List:
                </div>
                <div className="w-full p-4 pt-1 justify-center grid grid-cols-3 gap-2">
                    {isLoading ? (
                        <> Loading...</>
                    ) : !leads || (!isLoading && leads === null) ? (
                        <>No leads at the moment.</>
                    ) : (
                        leads.map((lead, index) => {
                            return isPostLead(lead) ? (
                                <RedditPostLeadCard
                                    leadDetails={lead as PostLead}
                                    key={index}
                                />
                            ) : (
                                <RedditCommentLeadCard
                                    leadDetails={lead as CommentLead}
                                    key={index}
                                />
                            );
                        })
                    )}
                </div>
            </div>
            <RightSideBarLeadResult
                productID={selectedProduct?.id}
                productTitle={selectedProduct?.title}
            />
        </>
    );
}
