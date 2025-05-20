'use client';

import clsx from 'clsx';
import RedditLeadListItem from './item';
import { useState } from 'react';

interface RedditLeadListProps {
    productsList: { title: string; date: string }[];
    onSelectedProductChange: (index: number) => void;
    className?: string;
}

export default function RedditLeadList({
    className,
    productsList,
    onSelectedProductChange,
}: RedditLeadListProps) {
    const [selectedItemIdx, setSelecetdItemIdx] = useState<number>(0);

    return (
        <div
            className={clsx(
                'h-full text-secondarySize font-normal flex flex-col gap-y-2',
                className
            )}
        >
            {productsList.map((product, index) => {
                return (
                    <div
                        onClick={() => {
                            onSelectedProductChange(index);
                            setSelecetdItemIdx(index);
                        }}
                        key={index}
                    >
                        <RedditLeadListItem
                            className={clsx({
                                'bg-[#73b3bb30] hover:bg-[#73b3bb30]':
                                    selectedItemIdx === index,
                            })}
                            title={product.title}
                            date={product.date}
                        />
                    </div>
                );
            })}
        </div>
    );
}
