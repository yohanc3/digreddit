import clsx from 'clsx';
import {
    BiCollection,
    BiCheckCircle,
    BiErrorCircle,
    BiTrash,
    BiPlus,
    BiX,
} from 'react-icons/bi';
import { Button } from '../button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader } from '../dialog';
import { Collection } from '@/types/backend/db';
import { toast } from '@/hooks/use-toast';
import { MissingFieldError } from '../../error/form';
import { Input } from '../input';
import { Label } from '../label';

interface CollectionPageCardProps {
    className?: string;
    productID: string;
    collection: {
        id: string;
        title: string;
        description: string;
        subreddits: string[];
        createdAt: string;
        updatedAt: string;
    };
}

export default function CollectionPageCard({
    className,
    productID,
    collection,
}: CollectionPageCardProps) {
    const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
    return (
        <>
            <div
                className={clsx(
                    className,
                    'w-full flex flex-col gap-3 text-secondaryColor px-3 py-2 border hover:bg-primaryColor/10 cursor-pointer border-light rounded-lg transition-all duration-200 ease-in-out'
                )}
                onMouseDown={() => {
                    setIsCollectionDialogOpen(true);
                }}
            >
                <div className="flex flex-row items-center gap-x-1 text-xl font-semibold">
                    <BiCollection size={25} />
                    <div>{collection.title}</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                    {collection.description}
                </div>
                <div className="flex flex-wrap gap-1">
                    {collection.subreddits
                        .slice(0, 3)
                        .map((subreddit, index) => (
                            <span
                                key={index}
                                className="text-xs bg-primaryColor text-white px-2 py-1 rounded-full"
                            >
                                r/{subreddit}
                            </span>
                        ))}
                    {collection.subreddits.length > 3 && (
                        <span className="text-xs text-gray-500">
                            +{collection.subreddits.length - 3} more
                        </span>
                    )}
                </div>
            </div>
            <CollectionEditDialog
                productID={productID}
                isOpen={isCollectionDialogOpen}
                collection={collection}
                onOpenChange={(open: boolean) =>
                    setIsCollectionDialogOpen(open)
                }
            />
        </>
    );
}

interface CollectionEditDialogProps {
    productID: string;
    isOpen: boolean;
    collection: {
        id: string;
        title: string;
        description: string;
        subreddits: string[];
        createdAt: string;
        updatedAt: string;
    };
    onOpenChange: (open: boolean) => void;
}

interface CollectionFormData {
    title: string;
    description: string;
    subreddit: string;
    subreddits: string[];
}

interface CollectionFormErrors {
    title: boolean;
    description: boolean;
    subreddits: boolean;
}

function CollectionEditDialog({
    productID,
    isOpen,
    collection,
    onOpenChange,
}: CollectionEditDialogProps) {
    const { apiPost } = useFetch();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [collectionForm, setCollectionForm] = useState<CollectionFormData>({
        title: collection.title,
        description: collection.description,
        subreddit: '',
        subreddits: [...collection.subreddits],
    });
    const [errors, setErrors] = useState<CollectionFormErrors>({
        title: false,
        description: false,
        subreddits: false,
    });

    function handleCollectionTitleOnChange(e: ChangeEvent<HTMLInputElement>) {
        setCollectionForm((prev) => ({ ...prev, title: e.target.value }));
        if (errors.title) {
            setErrors((prev) => ({ ...prev, title: false }));
        }
    }

    function handleCollectionDescriptionOnChange(
        e: ChangeEvent<HTMLTextAreaElement>
    ) {
        setCollectionForm((prev) => ({ ...prev, description: e.target.value }));
        if (errors.description) {
            setErrors((prev) => ({ ...prev, description: false }));
        }
    }

    function handleSubredditInputOnChange(e: ChangeEvent<HTMLInputElement>) {
        setCollectionForm((prev) => ({ ...prev, subreddit: e.target.value }));
    }

    function handleAddSubreddit() {
        const trimmedSubreddit = collectionForm.subreddit.trim();

        if (!trimmedSubreddit) return;

        // Remove 'r/' prefix if user typed it
        const cleanedSubreddit = trimmedSubreddit.replace(/^r\//, '');

        if (
            cleanedSubreddit.length >= 3 &&
            cleanedSubreddit.length <= 21 &&
            !collectionForm.subreddits.includes(cleanedSubreddit)
        ) {
            setCollectionForm((prev) => ({
                ...prev,
                subreddits: [...prev.subreddits, cleanedSubreddit],
                subreddit: '', // Clear the input
            }));
            setErrors((prev) => ({ ...prev, subreddits: false }));
        } else if (collectionForm.subreddits.includes(cleanedSubreddit)) {
            toast({
                title: 'Subreddit already exists',
                description: 'This subreddit has already been added.',
            });
        } else if (cleanedSubreddit.length < 3) {
            toast({
                title: 'Subreddit too short',
                description:
                    'Subreddit names must be at least 3 characters long.',
            });
        } else if (cleanedSubreddit.length > 21) {
            toast({
                title: 'Subreddit too long',
                description: 'Subreddit names must be 21 characters or less.',
            });
        }
    }

    function handleSubredditInputEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddSubreddit();
        }
    }

    function handleRemoveSubreddit(subredditToRemove: string) {
        setCollectionForm((prev) => ({
            ...prev,
            subreddits: prev.subreddits.filter(
                (sub) => sub !== subredditToRemove
            ),
        }));
    }

    async function handleCollectionSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {
            title: !collectionForm.title,
            description: !collectionForm.description,
            subreddits: collectionForm.subreddits.length < 1,
        };

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        if (!hasErrors) {
            try {
                await apiPost('/api/product/collection/update', {
                    productID: productID,
                    title: collectionForm.title,
                    description: collectionForm.description,
                    subreddits: collectionForm.subreddits,
                    collectionID: collection.id,
                });

                queryClient.refetchQueries({
                    queryKey: ['userCollections'],
                });

                toast({
                    title: `Collection ${collectionForm.title} Updated`,
                    description: `${collectionForm.title} has been updated successfully.`,
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });

                onOpenChange(false);
                setIsSubmitting(false);
                setErrors({
                    title: false,
                    description: false,
                    subreddits: false,
                });
                return;
            } catch (error) {
                toast({
                    title: 'Something Went Wrong',
                    description: 'Try again later.',
                    action: <BiErrorCircle color="#f87171" size={35} />,
                });
            }
        } else {
            setErrors(newErrors);
        }
        setIsSubmitting(false);
    }

    async function handleCollectionDelete(collectionID: string) {
        try {
            await apiPost('api/product/collection/delete', { collectionID });

            queryClient.resetQueries({
                queryKey: ['userCollections'],
            });

            toast({
                title: 'Deleted Successfully',
                description: `Collection ${collection.title} has been deleted`,
                action: <BiCheckCircle color="#576F72" size={35} />,
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Something Went Wrong',
                description: 'Try deleting it again later.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-6 flex flex-col text-primaryColor">
                <DialogHeader className="flex flex-row justify-between p-2">
                    <div className="font-semibold flex flex-row items-center space-x-1">
                        <BiCollection size={27} />
                        <div>Collection:</div>
                    </div>
                    <div>
                        <Button
                            variant={'light'}
                            onClick={() =>
                                (window.location.href = `/dashboard?product=${productID}&collection=${collection.id}`)
                            }
                            disabled={isSubmitting}
                        >
                            View Leads
                        </Button>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleCollectionSubmit}
                    className="flex flex-col space-y-5"
                >
                    <div className="flex flex-col">
                        <Label>Title:</Label>
                        <Input
                            value={collectionForm.title}
                            name="title"
                            placeholder="Collection Title"
                            onChange={handleCollectionTitleOnChange}
                            className="border border-light p-2 rounded-md"
                            disabled={isSubmitting}
                        />
                        <MissingFieldError trigger={Boolean(errors.title)} />
                    </div>
                    <div className="flex flex-col">
                        <Label>Description:</Label>
                        <textarea
                            value={collectionForm.description}
                            name="description"
                            placeholder="Collection Description"
                            onChange={handleCollectionDescriptionOnChange}
                            className="border border-light p-2 rounded-md min-h-[80px]"
                            disabled={isSubmitting}
                        />
                        <MissingFieldError
                            trigger={Boolean(errors.description)}
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <Label>Subreddits:</Label>
                        <div className="space-y-2">
                            <p className="text-tertiaryColor text-xs">
                                Type a subreddit name (without r/) and press
                                Enter or click "Add" to add it to your
                                collection.
                            </p>
                            <div className="flex gap-2 items-center">
                                <Input
                                    value={collectionForm.subreddit}
                                    className="flex-1 py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                    placeholder="e.g., technology, programming, entrepreneur"
                                    onChange={handleSubredditInputOnChange}
                                    onKeyDown={
                                        handleSubredditInputEnterKeyPress
                                    }
                                    disabled={isSubmitting}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddSubreddit}
                                    disabled={
                                        isSubmitting ||
                                        !collectionForm.subreddit.trim()
                                    }
                                    className="px-3 flex items-center text-primaryColor text-sm"
                                >
                                    <BiPlus size={12} />
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Subreddits List */}
                        {collectionForm.subreddits.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
                                {collectionForm.subreddits.map(
                                    (subreddit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 px-3 py-1 bg-primaryColor text-white rounded-full text-sm"
                                        >
                                            <span>r/{subreddit}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSubreddit(
                                                        subreddit
                                                    )
                                                }
                                                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                                                disabled={isSubmitting}
                                            >
                                                <BiX size={14} />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-x-1">
                            <p className="text-xs text-primaryColor font-medium">
                                {collectionForm.subreddits.length} subreddits
                                added
                            </p>
                        </div>

                        <MissingFieldError
                            trigger={Boolean(errors.subreddits)}
                        />
                    </div>

                    <div className="w-full flex justify-between">
                        <Button
                            type="button"
                            variant={'lightDelete'}
                            className="!w-min"
                            disabled={isSubmitting}
                            onClick={async (e) => {
                                e.preventDefault();
                                setIsSubmitting(true);
                                await handleCollectionDelete(collection.id);
                                setIsSubmitting(false);
                            }}
                        >
                            <BiTrash size={50} />
                        </Button>
                        <Button
                            type="submit"
                            variant={'dark'}
                            className="!w-min"
                            disabled={isSubmitting}
                        >
                            Update Collection
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
