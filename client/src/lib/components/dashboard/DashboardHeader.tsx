'use client';

import { Products, LeadStage, Bookmark, Collection } from '@/types/backend/db';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { readableDateFormat } from '@/lib/frontend/utils/timeFormat';
import { Button } from '../ui/button';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '../ui/menubar';
import { ChevronDown, Trash, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { useState } from 'react';
import { LeadOptions } from './DashboardHandler';
import EditProductDialog from '../ui/product/editDialog';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
    BiBookmarks,
    BiFolder,
    BiFolderOpen,
    BiPlus,
    BiCollection,
} from 'react-icons/bi';
import { Badge } from '../ui/badge';
interface DashboardHeaderProps {
    products: Products[];
    selectedProduct: Products | null;
    onSelectedProductChange: (index: number) => void;
    selectedBookmark: string;
    setSelectedBoookMark: (val: string) => void;
    selectedCollection: string;
    setSelectedCollection: (val: string) => void;
    currentStage: LeadStage;
    handleStageChange: (stage: LeadStage) => void;
    setOpenBookmarkCreationDialog: (val: boolean) => void;
    setOpenCollectionCreationDialog: (val: boolean) => void;
    bookmarks: Bookmark[];
    isBookmarksLoading: boolean;
    collections: Collection[];
    isCollectionsLoading: boolean;
    totalCount: number;
    options: LeadOptions;
    setOptions: (options: LeadOptions) => void;
    sortingMethods: Array<{ value: string; label: string }>;
}

export function DashboardHeader({
    products,
    selectedProduct,
    selectedBookmark,
    onSelectedProductChange,
    setSelectedBoookMark,
    selectedCollection,
    setSelectedCollection,
    currentStage,
    handleStageChange,
    setOpenBookmarkCreationDialog,
    setOpenCollectionCreationDialog,
    bookmarks,
    isBookmarksLoading,
    collections,
    isCollectionsLoading,
    totalCount,
    options,
    setOptions,
    sortingMethods,
}: DashboardHeaderProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const search = useSearchParams();
    const { apiPost } = useFetch();
    const [confirmProductTitle, setConfirmProductTitle] = useState('');
    const [showLeadFilters, setShowLeadFilters] = useState(false);

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

    const getStageDisplayName = (stage: LeadStage) => {
        switch (stage) {
            case 'identification':
                return 'Identification';
            case 'initial_outreach':
                return 'Initial Outreach';
            case 'engagement':
                return 'Engagement';
            case 'skipped':
                return 'Skipped';
            default:
                return stage;
        }
    };

    const selectedProductIndex = products.findIndex(
        (p) => p.id === selectedProduct?.id
    );

    return (
        <div>
            <header className="flex items-center justify-between px-14 py-4 border-b border-light bg-white shadow-sm">
                <div className="flex items-center gap-x-3">
                    {/* Product Selector */}
                    <Select
                        onValueChange={(value) => {
                            const newIndex = parseInt(value, 10);
                            const newProductId = products[newIndex].id;

                            onSelectedProductChange(newIndex);
                            setSelectedBoookMark('');
                            // Defer query invalidation to after state update
                            setTimeout(() => {
                                // queryClient.removeQueries({ queryKey: ['allLeads', newProductId] });
                                queryClient.invalidateQueries({
                                    queryKey: ['allLeads', newProductId],
                                });
                            }, 0);
                        }}
                        value={
                            selectedProductIndex !== -1
                                ? String(selectedProductIndex)
                                : undefined
                        }
                    >
                        <SelectTrigger className="w-auto min-w-56 h-8 text-sm border-gray-300 hover:border-primaryColor focus:border-primaryColor">
                            <SelectValue placeholder="Select a product...">
                                {selectedProduct ? (
                                    <div className="text-left">
                                        <div className="font-medium text-primaryColor text-sm">
                                            {selectedProduct.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Started At:{' '}
                                            {readableDateFormat(
                                                selectedProduct.createdAt
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    'Select a product...'
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product, index) => (
                                <SelectItem
                                    key={product.id}
                                    value={String(index)}
                                >
                                    <div>
                                        <div className="font-medium text-primaryColor">
                                            {product.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Started At:{' '}
                                            {readableDateFormat(
                                                product.createdAt
                                            )}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedProduct && (
                        <EditProductDialog
                            productDetails={selectedProduct}
                            trigger={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white transition-colors"
                                >
                                    Product Settings
                                </Button>
                            }
                        />
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLeadFilters(!showLeadFilters)}
                        className={`h-8 px-3 text-xs border-primaryColor transition-colors ${
                            showLeadFilters
                                ? 'bg-primaryColor text-white'
                                : 'text-primaryColor hover:bg-primaryColor hover:text-white'
                        }`}
                    >
                        Lead Filters
                    </Button>
                </div>

                <div className="flex items-center gap-x-3">
                    {/* Stage Selector */}
                    <Menubar className="p-0 border-none">
                        <MenubarMenu>
                            <MenubarTrigger className="text-xs font-medium cursor-pointer flex items-center gap-x-2 border border-primaryColor rounded-md px-3 py-1.5 bg-primaryColor text-white hover:bg-opacity-90 transition-colors">
                                {getStageDisplayName(currentStage)} (
                                {totalCount})
                                <ChevronDown size={14} />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem
                                    onClick={() =>
                                        handleStageChange('identification')
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    Identification
                                </MenubarItem>
                                <MenubarItem
                                    onClick={() =>
                                        handleStageChange('initial_outreach')
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    Initial Outreach
                                </MenubarItem>
                                <MenubarItem
                                    onClick={() =>
                                        handleStageChange('engagement')
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    Engagement
                                </MenubarItem>
                                <MenubarItem
                                    onClick={() => handleStageChange('skipped')}
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    Skipped
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>

                    <Menubar className="p-0 border-none">
                        <MenubarMenu>
                            <MenubarTrigger className="text-xs font-medium cursor-pointer flex items-center gap-x-2 border border-primaryColor rounded-md px-3 py-1.5 bg-primaryColor text-white hover:bg-opacity-90 transition-colors">
                                <Plus size={14} />
                                Create New
                                <ChevronDown size={14} />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem
                                    onClick={() =>
                                        router.push('/create-product')
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    <Plus size={14} className="mr-2" />
                                    Product
                                </MenubarItem>
                                <MenubarItem
                                    onClick={() =>
                                        setOpenBookmarkCreationDialog(true)
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    <BiBookmarks size={14} className="mr-2" />
                                    Bookmark
                                </MenubarItem>
                                <MenubarItem
                                    onClick={() =>
                                        setOpenCollectionCreationDialog(true)
                                    }
                                    className="text-sm hover:bg-primaryColor hover:text-white cursor-pointer"
                                >
                                    <BiCollection size={14} className="mr-2" />
                                    Collection
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    {selectedProduct && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600"
                                    disabled={!selectedProduct}
                                >
                                    <Trash size={14} className="mr-1.5" />
                                    Delete Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-primaryColor">
                                        Delete Product
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-secondaryColor">
                                    To delete this product, please type the
                                    product name ({selectedProduct.title}) in
                                    the input below.
                                </DialogDescription>
                                <Input
                                    placeholder={selectedProduct.title}
                                    className="w-full h-8 text-sm border-gray-300 focus:border-primaryColor"
                                    onChange={(e) =>
                                        setConfirmProductTitle(e.target.value)
                                    }
                                />
                                <DialogFooter className="flex justify-between">
                                    <DialogClose asChild>
                                        <Button
                                            className="w-full h-8 text-sm"
                                            variant={'destructive'}
                                            onClick={() =>
                                                selectedProduct &&
                                                confirmProductTitle ===
                                                    selectedProduct.title
                                                    ? deleteProduct(
                                                          selectedProduct.id
                                                      )
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
            </header>

            {/* Lead Filters Bar */}
            {showLeadFilters && (
                <div className="bg-gray-50 border-b border-light px-14 py-4 transition-all duration-200">
                    <div className="flex items-center gap-x-6">
                        <div className="flex items-center gap-x-2">
                            <Label className="text-sm font-medium text-secondaryColor whitespace-nowrap">
                                Min Rating:
                            </Label>
                            <Input
                                type="number"
                                min={5}
                                max={10}
                                value={options.minRating}
                                step={1}
                                className="w-20 h-8 text-sm border-gray-300 focus:border-primaryColor"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (
                                        !isNaN(value) &&
                                        value >= 1 &&
                                        value <= 10
                                    ) {
                                        setOptions({
                                            ...options,
                                            minRating: value as
                                                | 5
                                                | 6
                                                | 7
                                                | 8
                                                | 9
                                                | 10,
                                        });
                                    }
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Label className="text-sm font-medium text-secondaryColor whitespace-nowrap">
                                Sort by:
                            </Label>
                            <Select
                                value={options.sortingMethod}
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
                                <SelectTrigger className="w-36 h-8 text-sm border-gray-300 focus:border-primaryColor">
                                    <SelectValue />
                                </SelectTrigger>
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
                            </Select>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-4 border-light border-b flex flex-row space-x-6">
                {/* Bookmarks Section */}
                <div className="flex flex-col space-y-2 flex-1 min-w-0">
                    <div className="flex flex-row items-center justify-between text-primaryColor !text-primarySize !font-semibold">
                        <div className="flex items-center gap-2">
                            <BiBookmarks size={23} />
                            <div>Bookmarks:</div>
                        </div>
                        <Badge
                            variant={'closedBookmark'}
                            onMouseDown={() =>
                                setOpenBookmarkCreationDialog(true)
                            }
                            className="whitespace-nowrap flex-shrink-0 cursor-pointer"
                        >
                            <BiPlus size={16} className="mr-1" /> Add Bookmark
                        </Badge>
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
                        <div className="flex gap-2 min-w-max">
                            {!isBookmarksLoading &&
                                bookmarks?.map((bookmark) => (
                                    <Badge
                                        key={bookmark.id}
                                        variant={
                                            selectedBookmark === bookmark.id
                                                ? 'openBookmark'
                                                : 'closedBookmark'
                                        }
                                        onMouseDown={() => {
                                            queryClient.removeQueries({
                                                queryKey: [
                                                    'allLeads',
                                                    selectedProduct?.id,
                                                ],
                                            });
                                            const newBookmarkId =
                                                selectedBookmark !== bookmark.id
                                                    ? bookmark.id
                                                    : '';
                                            setSelectedCollection('');
                                            setSelectedBoookMark(newBookmarkId);
                                            router.push(
                                                `/dashboard/?product=${selectedProduct?.id}${newBookmarkId ? `&bookmark=${newBookmarkId}` : ''}`
                                            );
                                        }}
                                        className="whitespace-nowrap flex-shrink-0"
                                    >
                                        <BiFolder size={23} />{' '}
                                        <div>{bookmark.title}</div>
                                    </Badge>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-gray-200 self-stretch"></div>

                {/* Collections Section */}
                <div className="flex flex-col space-y-2 flex-1 min-w-0">
                    <div className="flex flex-row items-center justify-between text-primaryColor !text-primarySize !font-semibold">
                        <div className="flex items-center gap-2">
                            <BiCollection size={23} />
                            <div>Collections:</div>
                        </div>
                        <Badge
                            variant={'closedBookmark'}
                            onMouseDown={() =>
                                setOpenCollectionCreationDialog(true)
                            }
                            className="whitespace-nowrap flex-shrink-0 cursor-pointer"
                        >
                            <BiPlus size={16} className="mr-1" /> Add Collection
                        </Badge>
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
                        <div className="flex gap-2 min-w-max">
                            {!isCollectionsLoading && !collections ? (
                                <div className="text-sm text-gray-500">
                                    No collections yet!
                                </div>
                            ) : (
                                !isCollectionsLoading &&
                                collections?.map((collection) => (
                                    <Badge
                                        key={collection.id}
                                        variant={
                                            selectedCollection === collection.id
                                                ? 'openBookmark'
                                                : 'closedBookmark'
                                        }
                                        onMouseDown={() => {
                                            queryClient.removeQueries({
                                                queryKey: [
                                                    'allLeads',
                                                    selectedProduct?.id,
                                                ],
                                            });
                                            const newCollectionId =
                                                selectedCollection !==
                                                collection.id
                                                    ? collection.id
                                                    : '';
                                            setSelectedBoookMark('');
                                            setSelectedCollection(
                                                newCollectionId
                                            );
                                            router.push(
                                                `/dashboard/?product=${selectedProduct?.id}${newCollectionId ? `&collection=${newCollectionId}` : ''}`
                                            );
                                        }}
                                        className="whitespace-nowrap flex-shrink-0"
                                    >
                                        <BiCollection size={23} />{' '}
                                        <div>{collection.title}</div>
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
