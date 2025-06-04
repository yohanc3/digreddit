'use client';
import { CommentLead, PostLead, LeadStage } from '@/types/backend/db';
import {
    BiUpvote,
    BiCommentDetail,
    BiTimeFive,
    BiLinkExternal,
    BiChevronDown,
    BiChevronUp,
    BiRightArrowAlt,
    BiBot,
} from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/lib/components/ui/dialog';
import { Badge } from '../badge';
import { useEffect, useState } from 'react';
import { timeAgo, isPostLead } from '@/util/utils';
import {
    useUpdateLeadInteraction,
    useUpdateLeadStage,
    useGenerateAIResponse,
    usePostComment,
} from '@/lib/frontend/tanstack/queries';
import { toast } from '@/hooks/use-toast';
import { getBrowserRedditAccessToken } from '@/lib/frontend/utils/getRedditOauthToken';
import { queryClient } from '@/app/providers';

// Helper function to get next stage and button text
function getNextStageInfo(currentStage: LeadStage): {
    nextStage: LeadStage | null;
    buttonText: string;
} {
    switch (currentStage) {
        case 'identification':
            return {
                nextStage: 'initial_outreach',
                buttonText: 'Post Comment',
            };
        case 'initial_outreach':
            return {
                nextStage: 'engagement',
                buttonText: 'Move to Engagement',
            };
        case 'engagement':
            return { nextStage: null, buttonText: 'Final Stage' };
        default:
            return { nextStage: null, buttonText: 'Unknown Stage' };
    }
}
import { useUpdateLeadInteraction } from '@/lib/frontend/tanstack/queries';
import { getBrowserRedditAccessToken } from '@/lib/frontend/utils/getRedditOauthToken';

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
    const updateLeadInteraction = useUpdateLeadInteraction();
    const updateLeadStage = useUpdateLeadStage();
    const generateAIResponse = useGenerateAIResponse();
    const postComment = usePostComment();

    const [aiResponse, setAiResponse] = useState<string>('');

    const { nextStage, buttonText } = getNextStageInfo(leadDetails.stage);

    function handleGenerateResponse() {
        generateAIResponse.mutate(
            {
                leadMessage: leadDetails.body,
                productID: leadDetails.productID,
            },
            {
                onSuccess: (generatedResponse: string) => {
                    setAiResponse(generatedResponse);
                },
            }
        );
    }

    function handleMoveToEngagement() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'engagement',
                isPost: false,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['allLeads'],
                    });
                    toast({
                        title: 'Lead moved to engagement.',
                        description:
                            'The lead has been moved to the engagement stage.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to move lead to engagement.',
                    });
                },
            }
        );
    }

    async function handlePostComment() {
        const accessToken = getBrowserRedditAccessToken();

        if (accessToken) {
            postComment.mutate(
                {
                    accessToken: accessToken,
                    thingID: leadDetails.id,
                    comment: aiResponse,
                    isPost: false,
                },
                {
                    onSuccess: () => {
                        setAiResponse('');
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the next stage.',
                        });
                        if (nextStage) {
                            updateLeadStage.mutate(
                                {
                                    leadID: leadDetails.id,
                                    stage: nextStage,
                                    isPost: false,
                                },
                                {
                                    onError: () => {
                                        toast({
                                            title: 'Error',
                                            description:
                                                'Failed to move lead to next stage.',
                                        });
                                    },
                                }
                            );
                        }
                    },
                    onError: () => {
                        toast({
                            title: 'Error',
                            description: 'Failed to post comment',
                        });
                    },
                }
            );
        } else {
            toast({
                title: 'Error',
                description: 'Please connect your Reddit account',
            });
        }
    }

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
                        <a
                            href={`https://www.reddit.com${leadDetails.url}`}
                            target="_blank"
                        >
                            <Button
                                variant={'light'}
                                onClick={() => {
                                    updateLeadInteraction({
                                        leadID: leadDetails.id,
                                        isPost: false,
                                    });
                                }}
                            >
                                Open <BiLinkExternal size={18} />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col pt-4 h-28">
                    <div className="text-tertiarySize font-medium text-tertiaryColor text-justify h-12">
                        {leadDetails.body.substring(0, 300) + '...'}
                    </div>
                </div>
            </div>

            <div>
                {/* Card Rating */}
                <div className="flex flex-row justify-between items-center">
                    <div className="items-center text-xs font-semibold text-tertiaryColor gap-x-1">
                        <p>
                            AI Lead Rating:{' '}
                            <span className="font-bold text-sm">
                                {leadDetails.rating}
                            </span>
                        </p>
                    </div>
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
                </div>
                {leadDetails.stage === 'identification' && (
                    <div>
                        {/* AI Response Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-tertiaryColor">
                                    Initial Outreach Response:
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateResponse}
                                    disabled={generateAIResponse.isPending}
                                    className="h-7 px-2 text-xs"
                                >
                                    {generateAIResponse.isPending ? (
                                        'Generating...'
                                    ) : (
                                        <>
                                            <BiBot size={14} className="mr-1" />
                                            Generate
                                        </>
                                    )}
                                </Button>
                            </div>
                            <textarea
                                value={aiResponse}
                                onChange={(e) => setAiResponse(e.target.value)}
                                placeholder="Initial outreach response goes here..."
                                className="w-full h-20 p-2 text-xs border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    {/* Stage Transition Button */}
                    {nextStage &&
                        (leadDetails.stage === 'identification' ||
                            leadDetails.stage === 'initial_outreach') && (
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                        leadDetails.stage === 'initial_outreach'
                                            ? handleMoveToEngagement
                                            : handlePostComment
                                    }
                                    className="w-full text-xs"
                                    disabled={postComment.isPending}
                                >
                                    {leadDetails.stage === 'identification' &&
                                    !postComment.isPending
                                        ? 'Post Comment'
                                        : postComment.isPending
                                          ? 'Sending...'
                                          : buttonText}
                                    {!postComment.isPending && (
                                        <BiRightArrowAlt
                                            size={16}
                                            className="ml-1"
                                        />
                                    )}
                                </Button>
                            </div>
                        )}
                </div>
            </div>

            <RedditLeadCardDialog
                lead={leadDetails}
                generateAIResponse={generateAIResponse}
                postComment={postComment}
                updateLeadStage={updateLeadStage}
            />
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
    const updateLeadInteraction = useUpdateLeadInteraction();
    const updateLeadStage = useUpdateLeadStage();
    const generateAIResponse = useGenerateAIResponse();
    const postComment = usePostComment();

    const [aiResponse, setAiResponse] = useState<string>('');

    const { nextStage, buttonText } = getNextStageInfo(leadDetails.stage);

    function handleMoveToEngagement() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'engagement',
                isPost: true,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['allLeads'],
                    });
                    toast({
                        title: 'Lead moved to engagement.',
                        description:
                            'The lead has been moved to the engagement stage.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to move lead to engagement.',
                    });
                },
            }
        );
    }

    function handleGenerateResponse() {
        const contentToAnalyze = `${leadDetails.title} ${leadDetails.body}`;
        generateAIResponse.mutate(
            {
                leadMessage: contentToAnalyze,
                productID: leadDetails.productID,
            },
            {
                onSuccess: (generatedResponse: string) => {
                    setAiResponse(generatedResponse);
                },
            }
        );
    }

    async function handlePostComment() {
        const accessToken = getBrowserRedditAccessToken();

        if (accessToken) {
            postComment.mutate(
                {
                    accessToken: accessToken,
                    thingID: leadDetails.id,
                    comment: aiResponse,
                    isPost: true,
                },
                {
                    onSuccess: () => {
                        setAiResponse('');
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the next stage.',
                        });
                        if (nextStage) {
                            updateLeadStage.mutate(
                                {
                                    leadID: leadDetails.id,
                                    stage: nextStage,
                                    isPost: true,
                                },
                                {
                                    onError: () => {
                                        toast({
                                            title: 'Error',
                                            description:
                                                'Failed to move lead to next stage.',
                                        });
                                    },
                                }
                            );
                        }
                    },
                    onError: () => {
                        toast({
                            title: 'Error',
                            description: 'Failed to post comment',
                        });
                    },
                }
            );
        } else {
            toast({
                title: 'Error',
                description: 'Please connect your Reddit account',
            });
        }
    }

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
                        <Button
                            variant={'light'}
                            onClick={() => {
                                updateLeadInteraction({
                                    leadID: leadDetails.id,
                                    isPost: true,
                                });
                            }}
                        >
                            Open <BiLinkExternal size={18} />
                        </Button>
                    </a>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col h-28">
                <div className="text-lg/6 font-semibold line-clamp-2">
                    {leadDetails.title}
                </div>

                <div className="text-tertiarySize text-tertiaryColor text-justify font-medium text-clip h-8">
                    {leadDetails.body.substring(0, 200) + '...'}
                </div>
            </div>

            <div className="flex flex-row justify-between items-center">
                {/* Card Rating */}
                <div className="items-center text-xs font-semibold text-tertiaryColor gap-x-1">
                    <p>
                        AI Lead Rating:{' '}
                        <span className="font-bold text-sm">
                            {leadDetails.rating}
                        </span>
                    </p>
                </div>
                {/* Reddit Post/Comment Details */}
                <div className="flex flex-row h-10 gap-x-3 items-center">
                    <div className="flex flex-row items-center justify-center gap-x-0.5">
                        <BiUpvote color="#D93900" size={18} />{' '}
                        <p className="text-tertiarySize text-tertiaryColor">
                            {' '}
                            2{' '}
                        </p>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-x-0.5">
                        <BiCommentDetail color="#344054" size={18} />{' '}
                        <p className="text-tertiarySize text-tertiaryColor">
                            {' '}
                            2{' '}
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
            </div>

            {/* AI Response Section */}
            {leadDetails.stage === 'identification' && (
                <div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-tertiaryColor">
                                Initial Outreach Response:
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateResponse}
                                disabled={generateAIResponse.isPending}
                                className="h-7 px-2 text-xs"
                            >
                                {generateAIResponse.isPending ? (
                                    'Generating...'
                                ) : (
                                    <>
                                        <BiBot size={14} className="mr-1" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </div>
                        <textarea
                            value={aiResponse}
                            onChange={(e) => setAiResponse(e.target.value)}
                            placeholder="Initial outreach response goes here..."
                            className="w-full h-20 p-2 text-xs border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col space-y-2 ">
                {/* Stage Transition Button */}
                {nextStage &&
                    (leadDetails.stage === 'identification' ||
                        leadDetails.stage === 'initial_outreach') && (
                        <div className="mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={
                                    leadDetails.stage === 'initial_outreach'
                                        ? handleMoveToEngagement
                                        : handlePostComment
                                }
                                className="w-full text-xs"
                                disabled={postComment.isPending}
                            >
                                {leadDetails.stage === 'identification' &&
                                !postComment.isPending
                                    ? 'Post Comment'
                                    : postComment.isPending
                                      ? 'Sending...'
                                      : buttonText}
                                {!postComment.isPending && (
                                    <BiRightArrowAlt
                                        size={16}
                                        className="ml-1"
                                    />
                                )}
                            </Button>
                        </div>
                    )}
            </div>

            <RedditLeadCardDialog
                lead={leadDetails}
                generateAIResponse={generateAIResponse}
                postComment={postComment}
                updateLeadStage={updateLeadStage}
            />
        </div>
    );
}

interface RedditLeadCardDialogProps {
    lead: CommentLead | PostLead;
    generateAIResponse: any;
    postComment: any;
    updateLeadStage: any;
}

function RedditLeadCardDialog({
    lead,
    generateAIResponse,
    postComment,
    updateLeadStage,
}: RedditLeadCardDialogProps) {
    const [showRedditDescription, setShowRedditDescription] =
        useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isConnectedToReddit, setIsConnectedToReddit] =
        useState<boolean>(false);

    const isPost = isPostLead(lead);
    const unixCreatedAt = new Date(lead.createdAt).getTime();
    const howLongAgo = timeAgo(unixCreatedAt);
    const upvotes = lead.ups - lead.downs;

    const updateLeadInteraction = useUpdateLeadInteraction();

    // Check Reddit connection status
    useEffect(() => {
        const accessToken = getBrowserRedditAccessToken();
        setIsConnectedToReddit(!!accessToken);
    }, []);

    // If the body is less than 240 words, show the full description
    useEffect(() => {
        if (lead.body.split(' ').length < 240) {
            setShowRedditDescription(true);
        }
    }, [lead.body]);

    function handleGenerateResponse() {
        const contentToAnalyze = isPost
            ? `${(lead as PostLead).title} ${lead.body}`
            : lead.body;

        generateAIResponse.mutate(
            {
                leadMessage: contentToAnalyze,
                productID: lead.productID,
            },
            {
                onSuccess: (generatedResponse: string) => {
                    setAiResponse(generatedResponse);
                },
            }
        );
    }

    async function handlePostComment() {
        const accessToken = getBrowserRedditAccessToken();

        if (accessToken) {
            postComment.mutate(
                {
                    accessToken: accessToken,
                    thingID: lead.id,
                    comment: aiResponse,
                    isPost: isPost,
                },
                {
                    onSuccess: () => {
                        setAiResponse('');
                        setIsOpen(false);
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the next stage.',
                        });
                        updateLeadStage.mutate(
                            {
                                leadID: lead.id,
                                stage: 'initial_outreach',
                                isPost: isPost,
                            },
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['allLeads'],
                                    });
                                },
                                onError: () => {
                                    toast({
                                        title: 'Error',
                                        description:
                                            'Failed to move lead to next stage.',
                                    });
                                },
                            }
                        );
                    },
                    onError: () => {
                        toast({
                            title: 'Error',
                            description: 'Failed to post comment',
                        });
                    },
                }
            );
        } else {
            toast({
                title: 'Error',
                description: 'Please connect your Reddit account',
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                            'rounded-xl px-4 py-2 !text-base !font-semibold',
                            {
                                'bg-orange-100 text-orange-600 border-orange-200':
                                    lead.rating < 3.3,
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
                        <h2
                            className={`text-lg font-semibold text-secondaryColor ${!showRedditDescription && 'line-clamp-2'}`}
                        >
                            {(lead as PostLead).title}
                        </h2>
                    )}

                    {/* Post Description with expand/collapse */}
                    <div
                        className={clsx(
                            'w-full relative transition-all duration-300 ease-in-out',
                            showRedditDescription
                                ? ''
                                : 'max-h-60 overflow-hidden'
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
                                    onClick={() =>
                                        setShowRedditDescription(true)
                                    }
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
                                    onClick={() =>
                                        setShowRedditDescription(false)
                                    }
                                >
                                    <BiChevronUp size={25} /> See Less
                                </button>
                            </div>
                        )}
                    </div>

                    {/* AI Response Section - Only show for identification stage */}
                    {lead.stage === 'identification' && (
                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondaryColor">
                                    Initial Outreach Response:
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateResponse}
                                    disabled={generateAIResponse.isPending}
                                    className="h-8 px-3 text-sm"
                                >
                                    {generateAIResponse.isPending ? (
                                        'Generating...'
                                    ) : (
                                        <>
                                            <BiBot size={16} className="mr-1" />
                                            Generate AI Response
                                        </>
                                    )}
                                </Button>
                            </div>
                            <textarea
                                value={aiResponse}
                                onChange={(e) => setAiResponse(e.target.value)}
                                placeholder="Type up an initial outreach response, or let AI generate one for you! Feel free to edit it before posting."
                                className="w-full h-60 p-3 text-sm border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {aiResponse && (
                                <div className="flex justify-end">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={handlePostComment}
                                        disabled={
                                            postComment.isPending ||
                                            !aiResponse.trim()
                                        }
                                        className="px-4 py-2"
                                    >
                                        {postComment.isPending ? (
                                            'Posting...'
                                        ) : (
                                            <>
                                                Post Comment & Move to Outreach
                                                <BiRightArrowAlt
                                                    size={16}
                                                    className="ml-1"
                                                />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reddit Connection Notice */}
                    {!isConnectedToReddit && (
                        <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="text-sm font-medium text-red-700">
                                ⚠️ Reddit Connection Required
                            </div>
                            <div className="text-xs text-red-600">
                                To interact with leads and post comments, please
                                connect your Reddit account first by clicking
                                the Reddit button in the navbar.
                            </div>
                        </div>
                    )}

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
                            {isPost && (
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                    <BiCommentDetail
                                        color="#344054"
                                        size={25}
                                    />
                                    <div>
                                        <p className="text-sm text-secondaryColor">
                                            Comments
                                        </p>
                                        <p className="text-xl font-semibold text-secondaryColor">
                                            {(lead as PostLead).numComments}
                                        </p>
                                    </div>
                                </div>
                            )}

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
                            <a
                                href={`${!isPost ? 'https://www.reddit.com' : ''}${lead.url}`}
                                target="_blank"
                            >
                                <Button
                                    variant="dark"
                                    className="w-36 h-9 text-sm"
                                    onClick={async () => {
                                        await updateLeadInteraction({
                                            leadID: lead.id,
                                            isPost,
                                        });
                                    }}
                                >
                                    View {isPost ? 'Post' : 'Comment'}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
