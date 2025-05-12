"use client"

import { BiChevronsLeft, BiPlus, BiTrash } from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import RedditLeadList from './list';
import { Products } from '@/types/backend/db';
import { useRouter } from 'next/navigation';

interface LeftSideBarLeadResultProps {
    products: Products[];
    onSelectedProductChange: (index: number) => void;
    className?: string;
}

interface RightSideBarLeadResultProps {
    className?: string;
}

export function LeftSideBarLeadResult({
    products,
    className,
    onSelectedProductChange,
}: LeftSideBarLeadResultProps) {
    const redditLeadListData: { title: string; date: string }[] = products.map(
        (product) => {
            const newDate = new Date(product.createdAt);

            // Get month name
            const month = newDate.toLocaleString('en-US', { month: 'long' });
            const day = newDate.getDate().toString().padStart(2, '0');
            const year = newDate.getFullYear();

            const formattedDate = `${month} ${day}, ${year}`;

            return {
                title: product.title,
                date: formattedDate,
            };
        }
    );

    return (
        <div
            className={clsx(
                'h-screen w-1/6 bg-white border border-light border-t-0 text-secondarySize font-normal px-2',
                className
            )}
        >
            <div className="flex justify-end">
                <BiChevronsLeft color="#576F72" size={24} />
            </div>
            <p className="text-secondarySize text-secondaryColor">Results:</p>
            <RedditLeadList
                productsList={redditLeadListData}
                onSelectedProductChange={onSelectedProductChange}
            />
        </div>
    );
}

export function RightSideBarLeadResult({
    className,
}: RightSideBarLeadResultProps) {
    const router = useRouter();
    return (
        <div
            className={clsx(
                'h-screen w-1/6 flex flex-col bg-white border border-light border-t-0 text-secondarySize font-normal px-3 pt-6 gap-y-1',
                className
            )}
        >
            <Button variant={'dark'} className="!justify-between w-full" onClick={()=>router.push("/create-product")}>
                Create New Request <BiPlus size={20} />
            </Button>
            <Button variant={'lightDelete'}>
                Delete Results <BiTrash size={20} />
            </Button>
        </div>
    );
}
