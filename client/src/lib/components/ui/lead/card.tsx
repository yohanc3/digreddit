'use client';
import { CommentLead, PostLead } from '@/types/backend/db';
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
import { timeAgo, isPostLead } from '@/util/utils';

interface RedditCommentLeadCardProps {
    leadDetails: CommentLead;
    className?: string;
}

export function RedditCommentLeadCard({
    className,
    leadDetails,
}: RedditCommentLeadCardProps) {
    const unixCreatedAt = new Date(leadDetails.createdAt).getTime();

    const howLongAgo = timeAgo(unixCreatedAt);

    return (
        <div
            className={clsx(
                'w-auto flex flex-col bg-white text-black p-3 rounded-lg gap-y-1 border border-light justify-between',
                className
            )}
        >
            <div>
                {/* Card Header */}
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <div className="text-secondaryColor text-primarySize font-semibold">
                            {leadDetails.subreddit}
                        </div>
                        <div className="text-tertiaryColor text-tertiarySize font-medium">
                            by: {leadDetails.author}
                        </div>
                    </div>
                    <div>
                        <a href={leadDetails.url} target="_blank">
                            <Button variant={'light'}>
                                Open <BiLinkExternal size={18} />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col pt-4 h-28">
                    <div className="text-tertiarySize font-medium text-tertiaryColor text-justify h-12">
                        {leadDetails.body.substring(0, 200) + '...'}
                    </div>
                </div>
            </div>

            <div>
                {/* Reddit Post/Comment Details */}
                <div className="flex flex-row h-10 gap-x-3 items-center">
                    <div className="flex flex-row items-center justify-center gap-x-0.5">
                        <BiUpvote color="#D93900" size={18} />{' '}
                        <p className="text-tertiarySize text-tertiaryColor">
                            {' '}
                            {leadDetails.ups - leadDetails.downs}{' '}
                        </p>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-x-1">
                        <BiTimeFive color="#344054" size={18} />{' '}
                        <p className="text-tertiarySize text-tertiaryColor">
                            {' '}
                            {howLongAgo}{' '}
                        </p>
                    </div>
                </div>

                {/* Card Rating */}
                <div
                className={clsx(
                    'items-center text-xs font-semibold text-tertiaryColor gap-x-1',
                    {
                        'text-orange-600': leadDetails.rating < 3.3,
                        'text-yellow-600':
                            leadDetails.rating < 5.5 &&
                            leadDetails.rating > 3.3,
                        'text-green-600':
                            leadDetails.rating <= 10 &&
                            leadDetails.rating > 5.5,
                    }
                )}
                >
                    <p>
                        AI Lead Rating:{' '}
                        <span className="font-bold text-sm">
                            {leadDetails.rating}
                        </span>
                    </p>
                </div>

                <RedditLeadCardDialog lead={leadDetails} />
            </div>
        </div>
    );
}

interface RedditPostLeadCardProps {
    leadDetails: PostLead;
    className?: string;
}

export function RedditPostLeadCard({
    className,
    leadDetails,
}: RedditPostLeadCardProps) {
    const unixCreatedAt = new Date(leadDetails.createdAt).getTime();

    const howLongAgo = timeAgo(unixCreatedAt);

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
                        {leadDetails.subreddit}
                    </div>
                    <div className="text-tertiaryColor text-tertiarySize font-medium">
                        by: {leadDetails.author}
                    </div>
                </div>
                <div>
                    <a href={leadDetails.url} target="_blank">
                        <Button variant={'light'}>
                            Open <BiLinkExternal size={18} />
                        </Button>
                    </a>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col h-28">
                <div className="text-mediumSize font-semibold line-clamp-2">
                    {leadDetails.title}
                </div>

                <div className="text-tertiarySize text-tertiaryColor text-justify font-medium text-clip h-8">
                    {leadDetails.body.substring(0, 200) + '...'}
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
                        {howLongAgo}{' '}
                    </p>
                </div>
            </div>

            {/* Card Rating */}
            <div
                className={clsx(
                    'items-center text-xs font-semibold text-tertiaryColor gap-x-1',
                    {
                        'text-orange-600': leadDetails.rating < 3.3,
                        'text-yellow-600':
                            leadDetails.rating < 6.6 &&
                            leadDetails.rating > 3.3,
                        'text-green-600':
                            leadDetails.rating <= 10 &&
                            leadDetails.rating > 6.6,
                    }
                )}
            >
                <p>
                    AI Lead Rating:{' '}
                    <span className="font-bold text-sm">
                        {leadDetails.rating}
                    </span>
                </p>
            </div>

            <RedditLeadCardDialog lead={leadDetails} />
        </div>
    );
}

interface RedditLeadCardDialogProps {
    lead: CommentLead | PostLead;
}

function RedditLeadCardDialog({ lead }: RedditLeadCardDialogProps) {
    const [showRedditDescription, setShowRedditDescription] =
        useState<boolean>(false);
    
    const isPost = isPostLead(lead);
    const unixCreatedAt = new Date(lead.createdAt).getTime();
    const howLongAgo = timeAgo(unixCreatedAt);
    const upvotes = lead.ups - lead.downs;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="dark" className="w-full py-2 text-sm">
                    Open Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-14 h-[85vh] overflow-y-auto flex flex-col">
                {/* Header - Subreddit info and rating */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-medium text-sm text-secondaryColor">
                            {lead.subreddit}
                        </h3>
                        <p className="text-xs text-tertiaryColor">
                            {lead.author}
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className={clsx(
                            "rounded-xl px-4 py-2 !text-base !font-semibold",
                            {
                                'bg-orange-100 text-orange-600 border-orange-200': lead.rating < 3.3,
                                'bg-yellow-100 text-yellow-600 border-yellow-200': 
                                    lead.rating < 6.6 && lead.rating >= 3.3,
                                'bg-green-100 text-green-600 border-green-200': 
                                    lead.rating <= 10 && lead.rating >= 6.6,
                            }
                        )}
                    >
                        Rating: {lead.rating}/10
                    </Badge>
                </div>

                <div className="flex flex-col gap-y-4 flex-grow">
                    {/* Post Title - Only shown for PostLead */}
                    {isPost && (
                        <h2 className={`text-lg font-semibold text-secondaryColor ${!showRedditDescription && "line-clamp-2"}`}>
                            {(lead as PostLead).title}
                        </h2>
                    )}

                    {/* Post Description with expand/collapse */}
                    <div
                        className={clsx(
                            'w-full relative transition-all duration-300 ease-in-out',
                            showRedditDescription ? '' : 'max-h-60 overflow-hidden'
                        )}
                    >
                        {/* Post content */}
                        <div className="text-sm text-tertiaryColor">
                            {lead.body}
                        </div>
                        
                        {/* Gradient overlay and "See More" button */}
                        {!showRedditDescription && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center w-full">
                                <button
                                    className="flex items-center text-sm text-tertiaryColor hover:text-secondaryColor transition-colors mb-1"
                                    onClick={() => setShowRedditDescription(true)}
                                >
                                    <BiChevronDown size={25} /> See More
                                </button>
                            </div>
                        )}
                        
                        {/* "See Less" button */}
                        {showRedditDescription && (
                            <div className="flex justify-center mt-4">
                                <button
                                    className="flex items-center text-sm text-tertiaryColor hover:text-secondaryColor transition-colors"
                                    onClick={() => setShowRedditDescription(false)}
                                >
                                    <BiChevronUp size={25} /> See Less
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto">
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
                                        {upvotes}
                                    </div>
                                </div>
                            </div>

                            {/* Comments - Only shown for PostLead */}
                            {isPost && <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <BiCommentDetail color="#344054" size={25} />
                                <div>
                                    <p className="text-sm text-secondaryColor">
                                        Comments
                                    </p>
                                    <p className="text-xl font-semibold text-secondaryColor">
                                        {lead.numComments}
                                    </p>
                                </div>
                            </div>}

                            {/* Posted Date */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <BiTimeFive color="#344054" size={25} />
                                <div>
                                    <p className="text-xs text-secondaryColor">
                                        Posted
                                    </p>
                                    <p className="text-xl font-semibold text-secondaryColor">
                                        {howLongAgo}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end mt-6">
                            <a href={`${!isPost ? 'https://www.reddit.com' : ''}${lead.url}`} target="_blank">
                                <Button variant="dark" className="w-36 h-9 text-sm">
                                    View Comment
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
