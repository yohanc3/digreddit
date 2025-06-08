import clsx from 'clsx';
import { BiBookmark, BiCheckCircle, BiErrorCircle, BiFolder, BiTrash } from 'react-icons/bi';
import { Button } from '../button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { isPostLead } from '@/util/utils';
import { Dialog, DialogContent, DialogHeader } from '../dialog';
import { PiSpinnerGapThin } from 'react-icons/pi';
import { Bookmark } from '@/types/backend/db';
import { toast } from '@/hooks/use-toast';
import { MissingFieldError } from '../../error/form';

interface BookmarkPageCardProps {
    className?: string;
    productID: string;
    bookmark: {
        id: string;
        title: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    }
}

export default function BookmarkPageCard({
    className,
    productID,
    bookmark,
}: BookmarkPageCardProps) {
    const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false)
    return (
        <>
            <div
                className={clsx(
                    className,
                    'w-full flex flex-col gap-3 text-secondaryColor px-3 py-2 border hover:bg-primaryColor/10 cursor-pointer border-light rounded-lg transition-all duration-200 ease-in-out'
                )}
                onMouseDown={() => {
                    setIsBookmarkDialogOpen(true);
                }}
            >
                <div className='flex flex-row items-center gap-x-1 text-xl font-semibold'>
                    <BiBookmark size={25} />
                    <div>
                        {bookmark.title}
                    </div>
                </div>
                <div>
                    {
                        bookmark.description
                    }
                </div>
            </div>
            <BookmarkCreationDialog productID={productID} isOpen={isBookmarkDialogOpen} bookmark={bookmark} onOpenChange={(open: boolean) => setIsBookmarkDialogOpen(open)} />
        </>
    );
}


interface RedditLeadBookmarkProps {
    productID: string,
    isOpen: boolean;
    bookmark: {
        id: string;
        title: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    };
    onOpenChange: (open: boolean) => void;
}

export interface BookmarkFormDataTarget extends EventTarget {
    description: { value: string };
    title: { value: string };
}

function BookmarkCreationDialog({
    productID,
    isOpen,
    bookmark,
    onOpenChange,
}: RedditLeadBookmarkProps) {
    const [bookmarkDetails, setBookmarkDetails] = useState({})
    const { apiPost } = useFetch()
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookmarkForm, setBookmarkForm] = useState({ title: bookmark.title, description: bookmark.description })
    const [errors, setErrors] = useState({ title: false, description: false })
    async function handleBookmarkSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const form = e.target as BookmarkFormDataTarget;
        const title = form.title.value;
        const description = form.description.value;

        const newErrors = {
            description: !description,
            title: !title
        };

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );



        if (!hasErrors) {
            try {

                const updatedBookmark = await apiPost("/api/product/bookmark/update", {
                    productID: productID,
                    title: title,
                    description: description,
                    bookmarkID: bookmark.id
                })
                queryClient.refetchQueries({
                    queryKey: ['userBookmarks']
                })

                toast({
                    title: `Bookmark ${title} Update`,
                    description: `${title} has been udpated to your Bookmarks List`,
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });


                onOpenChange(false)
                setIsSubmitting(false)
                setBookmarkForm({ title: title, description: description })
                setErrors({ title: false, description: false })
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
        setIsSubmitting(false)
    }

    function handleBoookmarkTitleOnChange(e: ChangeEvent<HTMLInputElement>) {
        setBookmarkForm((prev) => { return { ...prev, title: e.target.value } })
    }

    function handleBoookmarkDescriptionOnChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setBookmarkForm((prev) => { return { ...prev, description: e.target.value } })
    }

    async function handleBookMarkDelete(bookmarkID: string) {
        try {
            const deletedBookmark = await apiPost("api/product/bookmark/delete", { bookmarkID })

            queryClient.resetQueries({
                queryKey: ['userBookmarks']
            })

            toast({
                title: "Deleted Successfully",
                description: `Bookmark ${bookmark.title} has been deleted`,
                action: <BiCheckCircle color="#576F72" size={35} />,
            });
            onOpenChange(false)
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
                <DialogHeader className='flex flex-row justify-between p-2'>
                    <div className='font-semibold flex flex-row items-center space-x-1'>
                        <BiBookmark size={27} /><div>Bookmark:</div>
                    </div>
                    <div>
                        <Button variant={"light"} onClick={() => window.location.href = (`/dashboard?product=${productID}&bookmark=${bookmark.id}`)} disabled={isSubmitting}>
                            View Leads
                        </Button>
                    </div>
                </DialogHeader>
                <form onSubmit={handleBookmarkSubmit} className='flex flex-col space-y-5'>
                    <div className='flex flex-col'>
                        <label>
                            Title:
                        </label>
                        <input value={bookmarkForm.title} name="title" placeholder="Bookmark Title" onChange={handleBoookmarkTitleOnChange} className='border border-light p-2 rounded-md' disabled={isSubmitting} />
                        <MissingFieldError trigger={Boolean(errors.title)} />
                    </div>
                    <div className='flex flex-col'>
                        <label>
                            Description:
                        </label>
                        <textarea value={bookmarkForm.description} name="description" placeholder="Bookmark Description" onChange={handleBoookmarkDescriptionOnChange} className='border border-light p-2 rounded-md' disabled={isSubmitting} />
                        <MissingFieldError trigger={Boolean(errors.description)} />
                    </div>
                    <div className='w-full flex justify-between'>
                        <Button type='button' variant={"lightDelete"} className='!w-min' disabled={isSubmitting}
                            onClick={async (e) => {
                                e.preventDefault()
                                setIsSubmitting(true)
                                await handleBookMarkDelete(bookmark.id)
                                setIsSubmitting(false)
                            }}
                        >
                            <BiTrash size={50} />
                        </Button>
                        <Button type='submit' variant={'dark'} className='!w-min' disabled={isSubmitting}>
                            Update Bookmark
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

