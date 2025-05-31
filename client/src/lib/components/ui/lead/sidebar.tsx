'use client';

import { BiChevronsLeft, BiPlus, BiTrash } from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import RedditLeadList from './list';
import { Products } from '@/types/backend/db';
import { useRouter } from 'next/navigation';
import { readableDateFormat } from '@/lib/frontend/utils/timeFormat';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '../dialog';
import { Input } from '../input';
import { useState } from 'react';

interface LeftSideBarLeadResultProps {
    products: Products[];
    onSelectedProductChange: (index: number) => void;
    className?: string;
}

interface RightSideBarLeadResultProps {
    productID: string | undefined;
    productTitle?: string;
    className?: string;
}

export function LeftSideBarLeadResult({
    products,
    className,
    onSelectedProductChange,
}: LeftSideBarLeadResultProps) {
    const redditLeadListData: { title: string; date: string }[] = products.map(
        (product) => {
            const formattedDate = readableDateFormat(product.createdAt);
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
            <p className="text-secondarySize text-secondaryColor">
                Products list:
            </p>
            <RedditLeadList
                productsList={redditLeadListData}
                onSelectedProductChange={onSelectedProductChange}
            />
        </div>
    );
}

export function RightSideBarLeadResult({
    className,
    productID,
    productTitle,
}: RightSideBarLeadResultProps) {
    const router = useRouter();
    const { apiPost } = useFetch();
    const [confirmProductTitle, setConfirmProductTitle] = useState('');
    const { mutate: deleteProduct } = useMutation({
        mutationFn: async (productID: string) => {
            const { status } = await apiPost('api/product/delete', {
                productID,
            });

            return status;
        },
        onSuccess: () => {
            router.push('/dashboard');
            router.refresh();
            toast({
                title: 'Product deleted',
                description: 'Product deleted successfully!',
            });
        },
        onError: () => {
            toast({
                title: 'Failed to delete product',
                description: 'Please try again',
            });
        },
    });

    return (
        <div
            className={clsx(
                'h-screen w-1/6 flex flex-col bg-white border border-light border-t-0 text-secondarySize font-normal px-3 pt-6 gap-y-1',
                className
            )}
        >
            <Button
                variant={'dark'}
                className="!justify-between w-full"
                onClick={() => router.push('/create-product')}
            >
                Create New Product <BiPlus size={20} />
            </Button>

            {productID && productTitle && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={'destructive'}
                            className="!justify-between w-full bg-red-400"
                            disabled={!productID}
                        >
                            Delete Product <BiTrash size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            To delete this product, please type the product name
                            ({productTitle}) in the input below.
                        </DialogDescription>
                        <Input
                            placeholder={productTitle}
                            className="w-full"
                            onChange={(e) =>
                                setConfirmProductTitle(e.target.value)
                            }
                        />
                        <DialogFooter className="flex justify-between">
                            <DialogClose asChild>
                                <Button
                                    className="w-full"
                                    variant={'destructive'}
                                    onClick={() =>
                                        productID &&
                                        confirmProductTitle === productTitle
                                            ? deleteProduct(productID)
                                            : toast({
                                                  title: 'Incorrect product name',
                                                  description:
                                                      'Please try again with the correct product name',
                                              })
                                    }
                                >
                                    Delete Product
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
