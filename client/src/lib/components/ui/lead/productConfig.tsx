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
        Array.isArray(productDetails?.keywords) ? productDetails.keywords : []
    );

    function handleEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
        newKeyword: string
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            (event.target as HTMLInputElement).value = '';
            setKeywords((prev) => [...prev, newKeyword]);
        }
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
                    {/* Lead Dscription */}
                    <div className="text-secondarySize text-tertiaryColor text-justify">
                        {productDetails?.description
                            ? productDetails.description
                            : 'No product description.'}
                    </div>
                    {/* Lead Keywords */}
                    <div>
                        <p className="font-semibold text-secondaryColor text-primarySize">
                            Selected Keywords:
                        </p>
                        {productDetails &&
                        Array.isArray(productDetails.keywords) ? (
                            <div className="flex flex-wrap gap-1.5 w-full overflow-y-auto p-1">
                                {productDetails.keywords.map(
                                    (item: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant={'leadKeyword'}
                                            className="text-tertiarySize py-0.5 px-2 flex items-center justify-center gap-x-2"
                                        >
                                            {item}
                                        </Badge>
                                    )
                                )}
                            </div>
                        ) : (
                            <>No keywords so far!</>
                        )}
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="max-w-40">
                                <LightButton
                                    title="Edit Product"
                                    className="!py-1"
                                />
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
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={productDetails?.title}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="description"
                                        className="text-right"
                                    >
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={productDetails?.description}
                                        className="col-span-3"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        className="text-right"
                                        htmlFor="keywords"
                                    >
                                        Keywords
                                    </Label>

                                    <Input
                                        id="keywords"
                                        className="col-span-3"
                                        placeholder="e.g., Tax, Sports, or Law"
                                        onKeyDown={(e) => {
                                            handleEnterKeyPress(
                                                e,
                                                e.currentTarget.value
                                            );
                                        }}
                                    />
                                </div>

                                <>
                                    <div className="flex flex-wrap gap-1.5 w-full mt-2 p-1">
                                        {/* Keywords List */}
                                        {keywords.map(
                                            (item: string, index: number) => (
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
                                                            setKeywords(
                                                                (prev) => {
                                                                    return prev.filter(
                                                                        (
                                                                            keyword
                                                                        ) =>
                                                                            item !=
                                                                            keyword
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    />
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </>
                            </div>
                            <DialogFooter>
                                <LightButton title="Save Changes" onClick={async () => {
                                    
                                }}/>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
