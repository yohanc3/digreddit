'use client';
import { CommentLead, PostLead, LeadStage, Products } from '@/types/backend/db';
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
    useUpdateLeadStage,
    useGenerateAIResponse,
    usePostComment,
} from '@/lib/frontend/tanstack/queries';
import { toast } from '@/hooks/use-toast';
import { getBrowserRedditAccessToken } from '@/lib/frontend/utils/getRedditOauthToken';
import { useRedditUser } from '@/lib/frontend/hooks/useRedditUser';
import { useLeads } from '@/lib/frontend/hooks/useLeads';

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
        case 'skipped':
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

interface RedditCommentLeadCardProps {
    leadDetails: CommentLead;
    className?: string;
    selectedProduct: Products | null;
    isDialogOpen: boolean;
    onOpenDialog: () => void;
    onCloseDialog: () => void;
    aiResponse: string;
    onSetAiResponse: (response: string) => void;
    onClearAiResponse: () => void;
}

export function RedditCommentLeadCard({
    className,
    leadDetails,
    selectedProduct,
    isDialogOpen,
    onOpenDialog,
    onCloseDialog,
    aiResponse,
    onSetAiResponse,
    onClearAiResponse,
}: RedditCommentLeadCardProps) {
    const unixCreatedAt = new Date(leadDetails.createdAt).getTime();
    const howLongAgo = timeAgo(unixCreatedAt);
    const updateLeadStage = useUpdateLeadStage();
    const generateAIResponse = useGenerateAIResponse();
    const postComment = usePostComment();
    const { redditUserData, isRedditUserDataLoading } = useRedditUser();

    const { nextStage, buttonText } = getNextStageInfo(leadDetails.stage);

    // Determine if connected to Reddit
    const isConnectedToReddit = !isRedditUserDataLoading && !!redditUserData;

    const { refetchAllLeads } = useLeads(selectedProduct);

    function handleGenerateResponse() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

        generateAIResponse.mutate(
            {
                leadMessage: leadDetails.body,
                productID: leadDetails.productID,
            },
            {
                onSuccess: (generatedResponse: string) => {
                    onSetAiResponse(generatedResponse);
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
                    refetchAllLeads();
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

    function handleMoveToSkipped() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'skipped',
                isPost: false,
            },
            {
                onSuccess: () => {
                    refetchAllLeads();
                    toast({
                        title: 'Lead is Skipped.',
                        description: 'The lead has been Skipped.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to move lead to skipped stage.',
                    });
                },
            }
        );
    }

    function handleMoveToIdentification() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'identification',
                isPost: false,
            },
            {
                onSuccess: () => {
                    refetchAllLeads();
                    toast({
                        title: 'Lead moved back to identification.',
                        description:
                            'The lead has been moved back to the identification stage.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description:
                            'Failed to move lead to identification stage.',
                    });
                },
            }
        );
    }

    async function handlePostComment() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

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
                        onClearAiResponse();
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the initial outreach stage.',
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
                    <div className="flex flex-row items-center space-x-2">
                        <div
                            onMouseDown={
                                leadDetails.stage === 'skipped'
                                    ? handleMoveToIdentification
                                    : handleMoveToSkipped
                            }
                            className="text-xs !text-tertiaryColor hover:underline cursor-pointer"
                        >
                            {leadDetails.stage === 'skipped' ? 'Undo' : 'Skip'}
                        </div>
                        <a
                            href={`https://www.reddit.com${leadDetails.url}`}
                            target="_blank"
                        >
                            <Button variant={'light'}>
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
                {(leadDetails.stage === 'identification' ||
                    leadDetails.stage === 'skipped') && (
                    <div className="relative group">
                        {/* AI Response Section */}
                        <div
                            className={clsx(
                                'space-y-2 mt-2 transition-all duration-200',
                                !isConnectedToReddit &&
                                    'opacity-60 cursor-not-allowed'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-tertiaryColor">
                                    Initial Outreach Response:
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateResponse}
                                    disabled={
                                        !isConnectedToReddit ||
                                        generateAIResponse.isPending
                                    }
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
                                onChange={(e) =>
                                    onSetAiResponse(e.target.value)
                                }
                                placeholder={
                                    isConnectedToReddit
                                        ? 'Initial outreach response goes here...'
                                        : 'Connect to Reddit to enable this feature...'
                                }
                                disabled={!isConnectedToReddit}
                                className={clsx(
                                    'w-full h-20 p-2 text-xs border rounded-md resize-none focus:ring-2 focus:border-transparent',
                                    isConnectedToReddit
                                        ? 'border-gray-200 focus:ring-blue-500 bg-white'
                                        : 'border-red-200 bg-red-50 text-gray-400 cursor-not-allowed'
                                )}
                            />
                        </div>

                        {/* Tooltip for disabled state */}
                        {!isConnectedToReddit && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                    <div className="font-medium mb-1">
                                        🔗 Reddit Connection Required
                                    </div>
                                    <div className="text-gray-200">
                                        Connect your Reddit account by clicking
                                        the Reddit button in the navigation bar.
                                    </div>

                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    {/* Stage Transition Button */}
                    {nextStage &&
                        (leadDetails.stage === 'identification' ||
                            leadDetails.stage === 'skipped' ||
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
                                    disabled={
                                        postComment.isPending ||
                                        ((leadDetails.stage ===
                                            'identification' ||
                                            leadDetails.stage === 'skipped') &&
                                            !isConnectedToReddit)
                                    }
                                >
                                    {(leadDetails.stage === 'identification' ||
                                        leadDetails.stage === 'skipped') &&
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
                selectedProduct={selectedProduct}
                isOpen={isDialogOpen}
                onOpenChange={(open: boolean) =>
                    open ? onOpenDialog() : onCloseDialog()
                }
                aiResponse={aiResponse}
                onSetAiResponse={onSetAiResponse}
                onClearAiResponse={onClearAiResponse}
            />
        </div>
    );
}

interface RedditPostLeadCardProps {
    leadDetails: PostLead;
    className?: string;
    selectedProduct: Products | null;
    isDialogOpen: boolean;
    onOpenDialog: () => void;
    onCloseDialog: () => void;
    aiResponse: string;
    onSetAiResponse: (response: string) => void;
    onClearAiResponse: () => void;
}

export function RedditPostLeadCard({
    className,
    leadDetails,
    selectedProduct,
    isDialogOpen,
    onOpenDialog,
    onCloseDialog,
    aiResponse,
    onSetAiResponse,
    onClearAiResponse,
}: RedditPostLeadCardProps) {
    const unixCreatedAt = new Date(leadDetails.createdAt).getTime();
    const howLongAgo = timeAgo(unixCreatedAt);
    const updateLeadStage = useUpdateLeadStage();
    const generateAIResponse = useGenerateAIResponse();
    const postComment = usePostComment();
    const { redditUserData, isRedditUserDataLoading } = useRedditUser();

    const { nextStage, buttonText } = getNextStageInfo(leadDetails.stage);

    // Determine if connected to Reddit
    const isConnectedToReddit = !isRedditUserDataLoading && !!redditUserData;

    const { refetchAllLeads } = useLeads(selectedProduct);

    function handleMoveToEngagement() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'engagement',
                isPost: true,
            },
            {
                onSuccess: () => {
                    refetchAllLeads();
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

    function handleMoveToSkipped() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'skipped',
                isPost: true,
            },
            {
                onSuccess: () => {
                    refetchAllLeads();
                    toast({
                        title: 'Lead is Skipped.',
                        description: 'The lead has been Skipped.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to move lead to skipped stage.',
                    });
                },
            }
        );
    }

    function handleMoveToIdentification() {
        updateLeadStage.mutate(
            {
                leadID: leadDetails.id,
                stage: 'identification',
                isPost: true,
            },
            {
                onSuccess: () => {
                    refetchAllLeads();
                    toast({
                        title: 'Lead moved back to identification.',
                        description:
                            'The lead has been moved back to the identification stage.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description:
                            'Failed to move lead to identification stage.',
                    });
                },
            }
        );
    }

    function handleGenerateResponse() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

        const contentToAnalyze = `${leadDetails.title} ${leadDetails.body}`;
        generateAIResponse.mutate(
            {
                leadMessage: contentToAnalyze,
                productID: leadDetails.productID,
            },
            {
                onSuccess: (generatedResponse: string) => {
                    onSetAiResponse(generatedResponse);
                },
            }
        );
    }

    async function handlePostComment() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

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
                        onClearAiResponse();
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the initial outreach stage.',
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
                <div className="flex flex-row items-center space-x-2">
                    <div
                        onMouseDown={
                            leadDetails.stage === 'skipped'
                                ? handleMoveToIdentification
                                : handleMoveToSkipped
                        }
                        className="text-xs !text-tertiaryColor hover:underline cursor-pointer"
                    >
                        {leadDetails.stage === 'skipped' ? 'Undo' : 'Skip'}
                    </div>
                    <a href={leadDetails.url} target="_blank">
                        <Button variant={'light'}>
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
            {(leadDetails.stage === 'identification' ||
                leadDetails.stage === 'skipped') && (
                <div className="relative group">
                    <div
                        className={clsx(
                            'space-y-2 mt-2 transition-all duration-200',
                            !isConnectedToReddit &&
                                'opacity-60 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-tertiaryColor">
                                Initial Outreach Response:
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateResponse}
                                disabled={
                                    !isConnectedToReddit ||
                                    generateAIResponse.isPending
                                }
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
                            onChange={(e) => onSetAiResponse(e.target.value)}
                            placeholder={
                                isConnectedToReddit
                                    ? 'Initial outreach response goes here...'
                                    : 'Connect to Reddit to enable this feature...'
                            }
                            disabled={!isConnectedToReddit}
                            className={clsx(
                                'w-full h-20 p-2 text-xs border rounded-md resize-none focus:ring-2 focus:border-transparent',
                                isConnectedToReddit
                                    ? 'border-gray-200 focus:ring-blue-500 bg-white'
                                    : 'border-red-200 bg-red-50 text-gray-400 cursor-not-allowed'
                            )}
                        />
                    </div>

                    {/* Tooltip for disabled state */}
                    {!isConnectedToReddit && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                <div className="font-medium mb-1">
                                    🔗 Reddit Connection Required
                                </div>
                                <div className="text-gray-200">
                                    Connect your Reddit account by clicking the
                                    Reddit button in the navigation bar.
                                </div>

                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col space-y-2 ">
                {/* Stage Transition Button */}
                {nextStage &&
                    (leadDetails.stage === 'identification' ||
                        leadDetails.stage === 'skipped' ||
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
                                disabled={
                                    postComment.isPending ||
                                    ((leadDetails.stage === 'identification' ||
                                        leadDetails.stage === 'skipped') &&
                                        !isConnectedToReddit)
                                }
                            >
                                {(leadDetails.stage === 'identification' ||
                                    leadDetails.stage === 'skipped') &&
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
                selectedProduct={selectedProduct}
                isOpen={isDialogOpen}
                onOpenChange={(open: boolean) =>
                    open ? onOpenDialog() : onCloseDialog()
                }
                aiResponse={aiResponse}
                onSetAiResponse={onSetAiResponse}
                onClearAiResponse={onClearAiResponse}
            />
        </div>
    );
}

interface RedditLeadCardDialogProps {
    lead: CommentLead | PostLead;
    generateAIResponse: any;
    postComment: any;
    updateLeadStage: any;
    selectedProduct: Products | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    aiResponse: string;
    onSetAiResponse: (response: string) => void;
    onClearAiResponse: () => void;
}

function RedditLeadCardDialog({
    lead,
    generateAIResponse,
    postComment,
    updateLeadStage,
    selectedProduct,
    isOpen,
    onOpenChange,
    aiResponse,
    onSetAiResponse,
    onClearAiResponse,
}: RedditLeadCardDialogProps) {
    const [showRedditDescription, setShowRedditDescription] =
        useState<boolean>(false);
    const [isConnectedToReddit, setIsConnectedToReddit] =
        useState<boolean>(false);

    const isPost = isPostLead(lead);
    const unixCreatedAt = new Date(lead.createdAt).getTime();
    const howLongAgo = timeAgo(unixCreatedAt);
    const upvotes = lead.ups - lead.downs;

    const { redditUserData, isRedditUserDataLoading } = useRedditUser();

    const { refetchAllLeads } = useLeads(selectedProduct);

    // If the body is less than 240 words, show the full description
    useEffect(() => {
        if (lead.body.split(' ').length < 240) {
            setShowRedditDescription(true);
        }
    }, [lead.body]);

    // Determine if connected to Reddit
    useEffect(() => {
        setIsConnectedToReddit(!isRedditUserDataLoading && !!redditUserData);
    }, [isRedditUserDataLoading, redditUserData]);

    function handleGenerateResponse() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

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
                    onSetAiResponse(generatedResponse);
                },
            }
        );
    }

    async function handlePostComment() {
        if (!isConnectedToReddit) {
            toast({
                title: 'Reddit Connection Required',
                description:
                    'Please connect your Reddit account first by clicking the Reddit button in the navbar.',
            });
            return;
        }

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
                        onClearAiResponse();
                        toast({
                            title: 'Comment posted successfully. Moving lead to next stage.',
                            description:
                                'Your comment has been successfully posted. The lead will now be moved to the initial outreach stage.',
                        });
                        updateLeadStage.mutate(
                            {
                                leadID: lead.id,
                                stage: 'initial_outreach',
                                isPost: isPost,
                            },
                            {
                                onSuccess: () => {
                                    refetchAllLeads();
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
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                    {(lead.stage === 'identification' ||
                        lead.stage === 'skipped') && (
                        <div className="relative group">
                            <div
                                className={clsx(
                                    'space-y-4 p-4 border rounded-lg transition-all duration-200',
                                    isConnectedToReddit
                                        ? 'border-gray-200 bg-gray-50'
                                        : 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-secondaryColor">
                                        Initial Outreach Response:
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateResponse}
                                        disabled={
                                            !isConnectedToReddit ||
                                            generateAIResponse.isPending
                                        }
                                        className="h-8 px-3 text-sm"
                                    >
                                        {generateAIResponse.isPending ? (
                                            'Generating...'
                                        ) : (
                                            <>
                                                <BiBot
                                                    size={16}
                                                    className="mr-1"
                                                />
                                                Generate AI Response
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <textarea
                                    value={aiResponse}
                                    onChange={(e) =>
                                        onSetAiResponse(e.target.value)
                                    }
                                    placeholder={
                                        isConnectedToReddit
                                            ? 'Type up an initial outreach response, or let AI generate one for you! Feel free to edit it before posting.'
                                            : 'Connect to Reddit to enable this feature...'
                                    }
                                    disabled={!isConnectedToReddit}
                                    className={clsx(
                                        'w-full h-60 p-3 text-sm border rounded-md resize-none focus:ring-2 focus:border-transparent',
                                        isConnectedToReddit
                                            ? 'border-gray-200 focus:ring-blue-500 bg-white'
                                            : 'border-red-200 bg-red-50 text-gray-400 cursor-not-allowed'
                                    )}
                                />
                                {aiResponse && isConnectedToReddit && (
                                    <div className="flex justify-end">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            onClick={handlePostComment}
                                            disabled={
                                                !isConnectedToReddit ||
                                                postComment.isPending ||
                                                !aiResponse.trim()
                                            }
                                            className="px-4 py-2"
                                        >
                                            {postComment.isPending ? (
                                                'Posting...'
                                            ) : (
                                                <>
                                                    Post Comment & Move to
                                                    Outreach
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

                            {/* Tooltip for disabled state */}
                            {!isConnectedToReddit && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                    <div className="bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg">
                                        <div className="font-medium mb-1">
                                            🔗 Reddit Connection Required
                                        </div>
                                        <div className="text-gray-200">
                                            Connect your Reddit account by
                                            clicking the Reddit button in the
                                            navbar to use AI response features.
                                        </div>

                                        {/* Tooltip Arrow */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                                    </div>
                                </div>
                            )}
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
