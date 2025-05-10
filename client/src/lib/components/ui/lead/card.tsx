'use client';
import { Lead } from '@/types/backend/db';
import {
    BiUpvote,
    BiCommentDetail,
    BiTimeFive,
    BiLinkExternal,
    BiChevronDown,
    BiChevronUp,
} from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/lib/components/ui/dialog';
import { Badge } from '../badge';
import { useState } from 'react';

interface RedditLeadCardProps {
    leadDetails?: Lead;
    className?: string;
}

export default function RedditLeadCard({ className }: RedditLeadCardProps) {
    const [showRedditDescription, setShowRedditDescription] =
        useState<boolean>(false);
    return (
        <div
            className={clsx(
                'w-auto flex flex-col bg-white text-black p-3 rounded-lg gap-y-1 border border-light',
                className
            )}
        >
            {/* Card Header */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-secondaryColor text-primarySize font-semibold">
                        r/Philippines
                    </div>
                    <div className="text-tertiaryColor text-tertiarySize">
                        by: u/jilinjames
                    </div>
                </div>
                <div>
                    <Button variant={'light'}>
                        Open <BiLinkExternal size={18} />
                    </Button>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col">
                <div className="text-mediumSize font-semibold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <div className="text-tertiarySize text-tertiaryColor text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                    sodales lorem mollis auctor. Integer commodo lacus risus,
                    vitae porttitor augue viverra quis. Aenean blandit fermentum
                    lorem, id interdum mauris semper quis. Donec consectetur
                    maximus orci, sed facilisis nibh varius in. Vivamus at dui
                    id nibh dignissim sodales. Duis condimentum eu mauris id
                    porta. In dapibus suscipit neque in blandit. Fusce arcu
                    sapien, sagittis ac convallis viverra, faucibus sed justo.
                    Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                    vestibulum lacus. Phasellus ut turpis malesuada lectus
                    laoreet pulvinar at non lacus. Sed volutpat ac purus
                    facilisis malesuada.
                </div>
            </div>

            {/* Reddit Post/Comment Details */}
            <div className="flex flex-row h-10 gap-x-3 items-center">
                <div className="flex flex-row items-center justify-center gap-x-0.5">
                    <BiUpvote color="#D93900" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor"> 2 </p>
                </div>

                <div className="flex flex-row items-center justify-center gap-x-0.5">
                    <BiCommentDetail color="#344054" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor"> 2 </p>
                </div>
                <div className="flex flex-row items-center justify-center gap-x-1">
                    <BiTimeFive color="#344054" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor">
                        {' '}
                        3 Weeks Ago{' '}
                    </p>
                </div>
            </div>

            {/* Card Rating */}
            <div className="flex flex-row items-center text-tertiarySize text-tertiaryColor gap-x-1">
                <p>Lead Rating:</p> <p> 7/10 </p>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="dark" className="w-full py-2 text-sm">
                        Open Details
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-14 h-[85vh] overflow-y-auto">
                    {/* Header - Subreddit info and rating */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-medium text-sm text-secondaryColor">
                                r/Philippines
                            </h3>
                            <p className="text-xs text-tertiaryColor">
                                u/randomguy
                            </p>
                        </div>
                        <Badge
                            variant="dark"
                            className="rounded-xl px-4 py-2 !text-base !font-semibold"
                        >
                            Rating: 7/10
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-y-4">
                        {/* Post Title */}
                        <h2 className="text-lg font-semibold text-secondaryColor">
                            Lorem ipsum dolor sit amet, consectetur adipscing
                            elit.
                        </h2>

                        {/* Post Description with expand/collapse */}
                        <div
                            className={clsx(
                                'w-full relative transition-all duration-300 ease-in-out',
                                showRedditDescription
                                    ? 'max-h-full'
                                    : 'max-h-40'
                            )}
                        >
                            {/* Gradient overlay and "See More" button */}
                            {!showRedditDescription && (
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent flex items-end justify-center">
                                    <button
                                        className="flex items-center text-sm text-tertiaryColor hover:text-secondaryColor transition-colors"
                                        onClick={() =>
                                            setShowRedditDescription(true)
                                        }
                                    >
                                        <BiChevronDown size={25} /> See More
                                    </button>
                                </div>
                            )}

                            {/* Post content */}
                            <div className="text-sm text-tertiaryColor">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed dictum scelerisque rutrum.
                                Mauris consequat cursus sem, eget sodales lorem
                                mollis auctor. Integer commodo lacus risus,
                                vitae porttitor augue viverra quis. Aenean
                                blandit fermentum lorem, id interdum mauris
                                semper quis. Donec consectetur maximus orci, sed
                                facilisis nibh varius in. Vivamus at dui id nibh
                                dignissim sodales. Duis condimentum eu mauris id
                                porta. In dapibus suscipit neque in blandit.
                                Fusce arcu sapien, sagittis ac convallis
                                viverra, faucibus sed justo. Vestibulum eu
                                tincidunt velit, sed vehicula dolor. Sed sed
                                vestibulum lacus. Phasellus ut turpis malesuada
                                lectus laoreet pulvinar at non lacus. Sed
                                volutpat ac purus facilisis malesuada.
                                {/* Repeated lorem ipsum text omitted for brevity */}
                                {/* "See Less" button */}
                                {showRedditDescription && (
                                    <button
                                        className="flex items-center text-sm text-tertiaryColor hover:text-secondaryColor transition-colors mt-4 mx-auto"
                                        onClick={() =>
                                            setShowRedditDescription(false)
                                        }
                                    >
                                        <BiChevronUp size={25} /> See More
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Post Stats */}
                        <div className="grid grid-cols-3 gap-3 my-2">
                            {/* Upvotes */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <div className="items-center justify-center h-min">
                                    <BiUpvote color="#D93900" size={25} />
                                </div>
                                <div className="items-center justify-center h-min">
                                    <div className="text-sm text-secondaryColor">
                                        Upvotes
                                    </div>
                                    <div className="text-xl text-secondaryColor font-semibold">
                                        1.4k
                                    </div>
                                </div>
                            </div>
                            {/* <Badge
                                variant={'leadDetails'}
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                            >
                                
                            </Badge> */}

                            {/* Comments */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <BiCommentDetail color="#344054" size={25} />
                                <div>
                                    <p className="text-sm text-secondaryColor">
                                        Comments
                                    </p>
                                    <p className="text-xl font-semibold text-secondaryColor">
                                        16
                                    </p>
                                </div>
                            </div>

                            {/* Posted Date */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <BiTimeFive color="#344054" size={25} />
                                <div>
                                    <p className="text-xs text-secondaryColor">
                                        Posted
                                    </p>
                                    <p className="text-xl font-semibold text-secondaryColor">
                                        16 Days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="mt-2">
                            <label className="text-sm font-medium text-secondaryColor block mb-2">
                                AI Generated Response:
                            </label>
                            <div className="border border-gray-100 rounded-md p-3 text-sm text-tertiaryColor bg-gray-50">
                                Thanks for sharing your thoughts! I really
                                appreciate you bringing this up. It actually
                                ties perfectly into something I wanted to
                                mention — if you're looking for a solution that
                                could help with this, you might want to check
                                out what we're offering. We've been working hard
                                on a product that's specifically designed to
                                make things easier, faster, and a lot more
                                efficient. It's built around the exact kinds of
                                challenges you're highlighting, and the feedback
                                from early users has been incredibly positive. I
                                won't go into a full pitch here, but if you're
                                curious, feel free to take a quick look! It
                                could save you a ton of time and effort compared
                                to trying to patch things together manually.
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end mt-2">
                            <Button variant="dark" className="w-36 h-9 text-sm">
                                View Comment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
