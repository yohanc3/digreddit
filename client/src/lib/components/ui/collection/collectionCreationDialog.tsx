'use client';

import { FormEvent, useState, ChangeEvent } from 'react';
import { Button } from '../button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog';
import { Input } from '../input';
import { Label } from '../label';
import { BiCollection, BiPlus, BiX } from 'react-icons/bi';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { MissingFieldError } from '../../error/form';

interface CollectionCreationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    productID: string;
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

export default function CollectionCreationDialog({
    isOpen,
    onOpenChange,
    productID,
}: CollectionCreationDialogProps) {
    const [collectionForm, setCollectionForm] = useState<CollectionFormData>({
        title: '',
        description: '',
        subreddit: '',
        subreddits: [],
    });
    const [errors, setErrors] = useState<CollectionFormErrors>({
        title: false,
        description: false,
        subreddits: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { apiPost } = useFetch();
    const queryClient = useQueryClient();

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
                await apiPost('/api/product/collection/create', {
                    productID: productID,
                    title: collectionForm.title,
                    description: collectionForm.description,
                    subreddits: collectionForm.subreddits,
                });

                queryClient.invalidateQueries({
                    queryKey: ['productCollections', productID],
                });

                toast({
                    title: 'Collection created',
                    description: 'Collection created successfully!',
                });

                onOpenChange(false);
                setIsSubmitting(false);
                setCollectionForm({
                    title: '',
                    description: '',
                    subreddit: '',
                    subreddits: [],
                });
                setErrors({
                    title: false,
                    description: false,
                    subreddits: false,
                });
                return;
            } catch (error) {
                toast({
                    title: 'Failed to create collection',
                    description: 'Please try again',
                });
            }
        } else {
            setErrors(newErrors);
        }
        setIsSubmitting(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-6 flex flex-col text-primaryColor">
                <DialogHeader>
                    <div className="font-semibold flex flex-row items-center space-x-1">
                        <BiCollection size={27} />
                        <div>Create Collection:</div>
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

                    <div className="w-full flex justify-end">
                        <Button
                            type="submit"
                            variant={'dark'}
                            className="!w-min"
                            disabled={isSubmitting}
                        >
                            Create Collection
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
