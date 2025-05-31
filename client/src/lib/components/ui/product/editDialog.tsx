'use client';

import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../dialog';
import { Label } from '../label';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Badge } from '../badge';
import { X } from 'lucide-react';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import {
    productKeywordsMaximumLength,
    productKeywordMinimumLength,
} from '@/lib/frontend/constant/form';
import { prohibitedKeywords } from '@/lib/backend/constant/prohibitedKeywords';
import LightButton from '../../button/light';
import type { Products } from '@/types/backend/db';
import { useProducts } from '@/lib/frontend/hooks/useProducts';
import { useRouter } from 'next/navigation';

interface EditProductDialogProps {
    productDetails: Products;
    trigger: React.ReactNode;
    onUpdateSuccess?: (updatedProduct: {
        title: string;
        description: string;
        keywords: string[];
    }) => void;
}

export default function EditProductDialog({
    productDetails,
    trigger,
    onUpdateSuccess,
}: EditProductDialogProps) {
    const { apiPost } = useFetch();
    const { refetchAllUserProducts } = useProducts();
    const router = useRouter();

    const [newTitle, setNewTitle] = useState<string>(
        productDetails?.title || ''
    );
    const [newDescription, setNewDescription] = useState<string>(
        productDetails?.description || ''
    );
    const [newKeywords, setNewKeywords] = useState<string[]>(
        (productDetails?.keywords as string[]) || []
    );
    const [currentKeywordInput, setCurrentKeywordInput] = useState<string>('');

    function handleKeywordSubmit() {
        const trimmedKeyword = currentKeywordInput.trim();

        if (!trimmedKeyword) return;

        if (prohibitedKeywords.includes(trimmedKeyword.toLowerCase())) {
            toast({
                title: 'Keyword is too common',
                description: 'Please avoid keywords that are too common.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        if (
            newKeywords.length < productKeywordsMaximumLength &&
            trimmedKeyword.length > productKeywordMinimumLength &&
            !newKeywords.includes(trimmedKeyword)
        ) {
            setNewKeywords((prev) => [...prev, trimmedKeyword]);
            setCurrentKeywordInput('');
        } else if (newKeywords.length >= productKeywordsMaximumLength) {
            toast({
                title: 'Maximum keywords reached',
                description: `You can only have up to ${productKeywordsMaximumLength} keywords.`,
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        } else if (newKeywords.includes(trimmedKeyword)) {
            toast({
                title: 'Keyword already exists',
                description: 'This keyword has already been added.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        }
    }

    function handleEnterKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleKeywordSubmit();
        }
    }

    function removeKeyword(keywordToRemove: string) {
        setNewKeywords((prev) =>
            prev.filter((keyword) => keyword !== keywordToRemove)
        );
    }

    async function handleSaveChanges() {
        try {
            const { status } = await apiPost('api/product/update', {
                productID: productDetails?.id,
                title: newTitle,
                description: newDescription,
                keywords: newKeywords,
            });

            if (status === 200) {
                // Call the optional callback for local state updates
                if (onUpdateSuccess) {
                    onUpdateSuccess({
                        title: newTitle,
                        description: newDescription,
                        keywords: newKeywords,
                    });
                }

                // Refresh the page to show the updated product
                refetchAllUserProducts();

                // Refresh router to update left sidebar products list
                router.refresh();

                // Show a success toast
                toast({
                    title: 'Product Successfully Updated!',
                    description:
                        'Changes will be reflected in new leads in 5-10 minutes',
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });
            }
        } catch (error) {
            toast({
                title: 'Error updating product',
                description: 'Please try again later.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-primaryColor mb-2">
                            Edit Product Details
                        </h2>
                        <p className="text-sm text-gray-600">
                            Make changes to your product information below.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Product Name
                            </Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full"
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                                className="w-full min-h-32 resize-y"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Keywords Section */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">
                                Keywords
                            </Label>

                            {/* Keywords Input */}
                            <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        value={currentKeywordInput}
                                        onChange={(e) =>
                                            setCurrentKeywordInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={handleEnterKeyPress}
                                        className="flex-1"
                                        placeholder="e.g., Tax, Sports, or Law"
                                    />
                                    <LightButton
                                        title="Add Keyword"
                                        onClick={handleKeywordSubmit}
                                        className="px-4 rounded-full p-[-4px]"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Hit enter or click "Add Keyword" to add the
                                    keyword
                                </p>
                            </div>

                            {/* Keywords Display */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 min-h-12 p-3 border rounded-md bg-gray-50">
                                    {newKeywords.length > 0 ? (
                                        newKeywords.map((keyword, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs py-1 px-2 flex items-center gap-1"
                                            >
                                                {keyword}
                                                <X
                                                    size={12}
                                                    className="cursor-pointer text-red-400 hover:text-red-600"
                                                    onClick={() =>
                                                        removeKeyword(keyword)
                                                    }
                                                />
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            No keywords added yet
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {newKeywords.length}/
                                    {productKeywordsMaximumLength} keywords
                                </p>
                            </div>
                        </div>
                        <DialogClose asChild>
                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <LightButton
                                    title="Save Changes"
                                    onClick={handleSaveChanges}
                                    className="px-8 rounded-full"
                                />
                            </div>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
