'use client';
import clsx from 'clsx';
import { Button } from '../button';
import { Badge } from '../badge';
import type { Products } from '@/types/backend/db';

interface ProductCardProps {
    leadDetails: Products;
    className?: string;
}

const industries = [
    'Estate Planning',
    'Attorney',
    'Estate',
    'Law',
    'NLBM',
    'New Law Business Model',
    'Clio',
    'WealthCounsel',
    'KeepSake',
    'Lorem',
    'ipsum dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'Sed',
    'dictum',
    'amet',
    'lorem',
    'elit',
    'locus',
];

export default function ProductCard({ leadDetails, className }: ProductCardProps) {
    return (
        <div
            className={clsx(
                'flex flex-col bg-white text-black p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
                className
            )}
        >
            {/* Product Header */}
            <h2 className="text-lg font-semibold text-secondaryColor mb-2">
                {leadDetails.title}
            </h2>

            {/* Product Description - Truncated */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {leadDetails.description}
            </p>

            {/* Keywords */}
            <div className="mt-auto">
                <p className="text-sm font-medium text-secondaryColor mb-2">
                    Keywords Selected:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {(leadDetails.keywords as string[]).slice(0, 12).map((item, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-xs py-0.5 px-2 bg-gray-50 border-gray-200 rounded-full"
                        >
                            {item}
                        </Badge>
                    ))}
                    {(leadDetails.keywords as string[]).length > 12 && (
                        <Badge
                            variant="outline"
                            className="text-xs py-0.5 px-2 bg-gray-50 border-gray-200 rounded-full"
                        >
                            + {industries.length - 12} More
                        </Badge>
                    )}
                </div>
            </div>

            {/* Open Details Button */}
            <Button variant="dark" className="w-full py-2 text-sm">
                Open Details
            </Button>
        </div>
    );
}
