"use client"

import clsx from 'clsx';
import { Button } from '../button';
import { useState } from 'react';
import { Badge } from '../badge';
import { Products } from '@/types/backend/db';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../dialog';
import { Label } from '../label';
import { Input } from '../input';
import LightButton from '../../button/light';
import { X } from 'lucide-react';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import { BiCheckCircle } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

interface ProductConfigProps {
    productDetails: Products | null;
    className?: string;
}

export default function ProductConfig({
    className,
    productDetails,
}: ProductConfigProps) {
    const [showProductConfig, setShowProductConfig] = useState(false);

    const [keywords, setKeywords] = useState<string[]>(productDetails?.keywords as string[] || []);
    const [description, setDescription] = useState<string>(productDetails?.description || 'No product description.');

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
                    {/* Lead Dscription */}
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
                    <EditProductDialog
                        productDetails={productDetails}
                        keywords={keywords}
                        setKeywords={setKeywords}
                        setDescription={setDescription}
                    />
                </>
            )}
        </div>
    );
}

interface EditProductConfigProps {
    productDetails: Products | null;
    keywords: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setKeywords: (prev: any) => void;
    setDescription: (prev: string) => void;
}

function EditProductDialog({
    productDetails,
    keywords,
    setKeywords,
    setDescription,
}: EditProductConfigProps) {
    const router = useRouter();

    const { apiPost } = useFetch();

    const [newTitle, setNewTitle] = useState<string>(
        productDetails?.title || ''
    );
    const [newDescription, setNewDescription] = useState<string>(
        productDetails?.description || ''
    );

    const [newKeywords, setNewKeywords] = useState<string[]>(
        (productDetails?.keywords as string[]) || []
    );

    function handleEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
        newKeyword: string
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            (event.target as HTMLInputElement).value = '';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setNewKeywords((prev: string[]) => [...prev, newKeyword]);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="max-w-40">
                    <LightButton title="Edit Product" className="!py-1" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your product here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue={productDetails?.title}
                            onChange={(e) => setNewTitle(e.currentTarget.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            defaultValue={productDetails?.description}
                            className="col-span-3"
                            onChange={(e) =>
                                setNewDescription(e.currentTarget.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="keywords">
                            Keywords
                        </Label>

                        <Input
                            id="keywords"
                            className="col-span-3"
                            placeholder="e.g., Tax, Sports, or Law"
                            onKeyDown={(e) => {
                                handleEnterKeyPress(e, e.currentTarget.value);
                            }}
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        <div className="flex flex-wrap gap-1.5 w-full mt-2 p-1 overflow-y-auto">
                            {newKeywords && newKeywords.length > 0 && newKeywords.map((item: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant={'leadKeyword'}
                                    className="text-xs py-0.5 px-2 flex items-center justify-center gap-x-2"
                                >
                                    {item}{' '}
                                    <X
                                        key={index}
                                        width={13}
                                        strokeWidth={3}
                                        className="cursor-pointer text-red-400"
                                        onClick={() =>
                                            setNewKeywords((prev: string[]) => {
                                                return prev.filter(
                                                    (keyword: string) =>
                                                        item != keyword
                                                );
                                            })
                                        }
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <LightButton
                        title="Save Changes"
                        onClick={async () => {

                            console.log("keywords", keywords);
                            const { status } = await apiPost(
                                'api/product/update',
                                {
                                    productID: productDetails?.id,
                                    title: newTitle,
                                    description: newDescription,
                                    keywords: newKeywords,
                                }
                            );

                            if (status === 200) {
                                router.refresh();
                                setKeywords([...newKeywords]);
                                setDescription(newDescription);
                                toast({
                                    title: `Product Successfully Updated!`,
                                    description:
                                        'New Leads will begin to propagate in 5-10 minutes',
                                    action: (
                                        <BiCheckCircle
                                            color="#576F72"
                                            size={35}
                                        />
                                    ),
                                });
                            }
                        }}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
