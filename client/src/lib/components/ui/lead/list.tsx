'use client';

import clsx from 'clsx';
import RedditLeadListItem from './item';

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
    return (
        <div
            className={clsx('h-1/2 text-secondarySize font-normal', className)}
        >
            {productsList.map((product, index) => {
                return (
                    <div
                        onClick={() => onSelectedProductChange(index)}
                        key={index}
                    >
                        <RedditLeadListItem
                            title={product.title}
                            date={product.date}
                        />
                    </div>
                );
            })}
        </div>
    );
}
