'use client';

import clsx from 'clsx';
import { Button } from '../button';
import { useState } from 'react';
import { Badge } from '../badge';
import { Products } from '@/types/backend/db';
import EditProductDialog from '../product/editDialog';
import LightButton from '../../button/light';

interface ProductConfigProps {
    productDetails: Products | null;
    className?: string;
}

export default function ProductConfig({
    className,
    productDetails,
}: ProductConfigProps) {
    const [showProductConfig, setShowProductConfig] = useState(false);

    const [keywords, setKeywords] = useState<string[]>(
        (productDetails?.keywords as string[]) || []
    );
    const [description, setDescription] = useState<string>(
        productDetails?.description || 'No product description.'
    );

    // Callback to update local state when product is updated
    function handleUpdateSuccess(updatedProduct: {
        title: string;
        description: string;
        keywords: string[];
    }) {
        setKeywords(updatedProduct.keywords);
        setDescription(updatedProduct.description);
    }

    return (
        <div className={clsx('p-4 w-full flex flex-col gap-y-2', className)}>
            <div className="flex items-center gap-x-5">
                <p className="font-semibold text-secondaryColor text-primarySize">
                    Product Settings:
                </p>
                <Button
                    variant={'light'}
                    onClick={() => setShowProductConfig(!showProductConfig)}
                    className="px-8 !h-7"
                >
                    {showProductConfig ? 'Hide' : 'Show'}
                </Button>
            </div>
            {showProductConfig && (
                <>
                    {/* Lead Description */}
                    <div className="text-secondarySize text-tertiaryColor text-justify">
                        {description}
                    </div>
                    {/* Lead Keywords */}
                    <div>
                        <p className="font-semibold text-secondaryColor text-primarySize">
                            Selected Keywords:
                        </p>
                        {productDetails &&
                        Array.isArray(productDetails.keywords) ? (
                            <div className="flex flex-wrap gap-1.5 w-full overflow-y-auto p-1">
                                {keywords.map((item: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant={'leadKeyword'}
                                        className="text-tertiarySize py-0.5 px-2 flex items-center justify-center gap-x-2"
                                    >
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <>No keywords so far!</>
                        )}
                    </div>
                    {productDetails && (
                        <EditProductDialog
                            productDetails={productDetails}
                            onUpdateSuccess={handleUpdateSuccess}
                            trigger={
                                <div className="max-w-40">
                                    <LightButton
                                        title="Edit Product"
                                        className="!py-1"
                                    />
                                </div>
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
}
