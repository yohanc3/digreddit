'use client';
import clsx from 'clsx';
import { Button } from '../button';
import { Badge } from '../badge';
import type { Products } from '@/types/backend/db';
import { Skeleton } from '../skeleton';

interface LoadingProductCardProps {
    className?: string;
}

export default function LoadingProductCard({ className }: LoadingProductCardProps) {
    return (
        <div
            className={clsx(
                'flex flex-col bg-white text-black p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
                className
            )}
        >
            {/* Product Header */}
            <Skeleton className="h-[3rem] mb-3" />


            {/* Product Description - Truncated */}
            <div className='flex flex-col gap-y-2'>
                <Skeleton className="h-[1rem] w-[90%]" />
                <Skeleton className="h-[1rem] w-[70%]" />
                <Skeleton className="h-[1rem] mb-4 w-full" />
            </div>
            
            {/* Keywords */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
                <Skeleton className="h-[1.25rem]" />
                <Skeleton className="h-[1.25rem]" />
                <Skeleton className="h-[1.25rem]" />
                <Skeleton className="h-[1.25rem]" />
                <Skeleton className="h-[1.25rem]" />
            </div>
            {/* Open Details Button */}
            <Skeleton className="h-[1.75rem] w-full py-2" />

        </div>
    );
}
