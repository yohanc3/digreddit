'use client';

import { CommentLead, PostLead, Products, LeadStage } from '@/types/backend/db';
import { useEffect, useState } from 'react';
import { RedditCommentLeadCard, RedditPostLeadCard } from '../ui/lead/card';
import { isPostLead } from '@/util/utils';
import { useLeads } from '@/lib/frontend/hooks/useLeads';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination';
import { LEADS_PER_PAGE } from '@/lib/frontend/constant/pagination';
import { DashboardHeader } from './DashboardHeader';

const sortingMethods = [
    {
        value: 'newest',
        label: 'Newest',
    },
    {
        value: 'oldest',
        label: 'Oldest',
    },
    {
        value: 'most-upvotes',
        label: 'Most Upvotes',
    },
    {
        value: 'least-upvotes',
        label: 'Least Upvotes',
    },
];

export interface LeadOptions {
    minRating: 5 | 6 | 7 | 8 | 9 | 10;
    sortingMethod: 'newest' | 'oldest' | 'most-upvotes' | 'least-upvotes';
    showOnlyUninteracted: boolean;
    stage: LeadStage;
}

// Stage pagination state interface
interface StagePagination {
    identification: number;
    initial_outreach: number;
    engagement: number;
    skipped: number;
}

export default function DashboardHandler({
    fetchedProducts,
}: {
    fetchedProducts: Products[];
}) {
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(
        fetchedProducts[0] || null
    );

    const [currentStage, setCurrentStage] =
        useState<LeadStage>('identification');

    // Separate pagination state for each stage
    const [stagePagination, setStagePagination] = useState<StagePagination>({
        identification: 0,
        initial_outreach: 0,
        engagement: 0,
        skipped: 0,
    });

    const [options, setOptions] = useState<LeadOptions>({
        minRating: 5,
        sortingMethod: 'newest',
        showOnlyUninteracted: false,
        stage: 'identification',
    });

    // State for dialog and AI responses, keyed by lead ID
    const [openDialogLeadId, setOpenDialogLeadId] = useState<string | null>(
        null
    );
    const [aiResponses, setAiResponses] = useState<Record<string, string>>({});

    const { leads, totalCount, isLoading } = useLeads(
        selectedProduct,
        options,
        stagePagination[currentStage]
    );

    const totalPages = Math.ceil(totalCount / LEADS_PER_PAGE);

    // Handler functions for dialog and AI responses
    function handleOpenDialog(leadId: string) {
        setOpenDialogLeadId(leadId);
    }

    function handleCloseDialog() {
        setOpenDialogLeadId(null);
    }

    function handleSetAiResponse(leadId: string, response: string) {
        setAiResponses((prev) => ({
            ...prev,
            [leadId]: response,
        }));
    }

    function handleClearAiResponse(leadId: string) {
        setAiResponses((prev) => {
            const newResponses = { ...prev };
            delete newResponses[leadId];
            return newResponses;
        });
    }

    function onSelectedProductChange(index: number) {
        setSelectedProduct(fetchedProducts[index]);
        // Reset pagination for all stages when changing products
        setStagePagination({
            identification: 0,
            initial_outreach: 0,
            engagement: 0,
            skipped: 0,
        });
    }

    function handlePageChange(page: number) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStagePagination((prev) => ({
            ...prev,
            [currentStage]: page,
        }));
    }

    function handleStageChange(stage: LeadStage) {
        setCurrentStage(stage);
        setOptions((prev) => ({
            ...prev,
            stage,
        }));
    }

    // Reset pagination when product or options change (except stage)
    useEffect(() => {
        setStagePagination({
            identification: 0,
            initial_outreach: 0,
            engagement: 0,
            skipped: 0,
        });
    }, [
        selectedProduct?.id,
        options.minRating,
        options.sortingMethod,
        options.showOnlyUninteracted,
    ]);

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

    return (
        <div className="flex flex-col h-screen">
            <DashboardHeader
                products={fetchedProducts}
                selectedProduct={selectedProduct}
                onSelectedProductChange={onSelectedProductChange}
                currentStage={currentStage}
                handleStageChange={handleStageChange}
                totalCount={totalCount}
                options={options}
                setOptions={setOptions}
                sortingMethods={sortingMethods}
            />

            <main className="flex-grow ">
                <div className="flex justify-between items-center px-14 py-4">
                    <div className="font-semibold text-primarySize text-secondaryColor">
                        Lead List at {getStageDisplayName(currentStage)} stage:
                    </div>
                </div>
                <div className="w-full py-4 px-12 pt-1 justify-center grid grid-cols-3 gap-4 min-h-96">
                    {isLoading ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <p className="text-primaryColor">Loading...</p>
                        </div>
                    ) : !leads || (!isLoading && leads.length === 0) ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <p className="text-primaryColor">
                                No leads in{' '}
                                {getStageDisplayName(
                                    currentStage
                                ).toLowerCase()}{' '}
                                stage at the moment.
                            </p>
                        </div>
                    ) : (
                        leads.map((lead, index) => {
                            return isPostLead(lead) ? (
                                <RedditPostLeadCard
                                    leadDetails={lead as PostLead}
                                    key={lead.id}
                                    selectedProduct={selectedProduct}
                                    isDialogOpen={openDialogLeadId === lead.id}
                                    onOpenDialog={() =>
                                        handleOpenDialog(lead.id)
                                    }
                                    onCloseDialog={handleCloseDialog}
                                    aiResponse={aiResponses[lead.id] || ''}
                                    onSetAiResponse={(response: string) =>
                                        handleSetAiResponse(lead.id, response)
                                    }
                                    onClearAiResponse={() =>
                                        handleClearAiResponse(lead.id)
                                    }
                                />
                            ) : (
                                <RedditCommentLeadCard
                                    leadDetails={lead as CommentLead}
                                    key={lead.id}
                                    selectedProduct={selectedProduct}
                                    isDialogOpen={openDialogLeadId === lead.id}
                                    onOpenDialog={() =>
                                        handleOpenDialog(lead.id)
                                    }
                                    onCloseDialog={handleCloseDialog}
                                    aiResponse={aiResponses[lead.id] || ''}
                                    onSetAiResponse={(response: string) =>
                                        handleSetAiResponse(lead.id, response)
                                    }
                                    onClearAiResponse={() =>
                                        handleClearAiResponse(lead.id)
                                    }
                                />
                            );
                        })
                    )}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                    <div className="flex justify-center py-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                                stagePagination[currentStage] >
                                                0
                                            ) {
                                                handlePageChange(
                                                    stagePagination[
                                                        currentStage
                                                    ] - 1
                                                );
                                            }
                                        }}
                                        className={
                                            stagePagination[currentStage] === 0
                                                ? 'pointer-events-none opacity-50 text-primaryColor'
                                                : 'text-primaryColor hover:text-primaryColor'
                                        }
                                    />
                                </PaginationItem>

                                {/* Show first page */}
                                {stagePagination[currentStage] > 2 && (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(0);
                                                }}
                                                className="text-primaryColor hover:text-primaryColor"
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        {stagePagination[currentStage] > 3 && (
                                            <PaginationItem>
                                                <PaginationEllipsis className="text-primaryColor" />
                                            </PaginationItem>
                                        )}
                                    </>
                                )}

                                {/* Show previous page */}
                                {stagePagination[currentStage] > 0 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    stagePagination[
                                                        currentStage
                                                    ] - 1
                                                );
                                            }}
                                            className="text-primaryColor hover:text-primaryColor"
                                        >
                                            {stagePagination[currentStage]}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Current page */}
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        isActive
                                        className="text-primaryColor"
                                    >
                                        {stagePagination[currentStage] + 1}
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Show next page */}
                                {stagePagination[currentStage] <
                                    totalPages - 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    stagePagination[
                                                        currentStage
                                                    ] + 1
                                                );
                                            }}
                                            className="text-primaryColor hover:text-primaryColor"
                                        >
                                            {stagePagination[currentStage] + 2}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Show last page */}
                                {stagePagination[currentStage] <
                                    totalPages - 3 && (
                                    <>
                                        {stagePagination[currentStage] <
                                            totalPages - 4 && (
                                            <PaginationItem>
                                                <PaginationEllipsis className="text-primaryColor" />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(
                                                        totalPages - 1
                                                    );
                                                }}
                                                className="text-primaryColor hover:text-primaryColor"
                                            >
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                                stagePagination[currentStage] <
                                                totalPages - 1
                                            ) {
                                                handlePageChange(
                                                    stagePagination[
                                                        currentStage
                                                    ] + 1
                                                );
                                            }
                                        }}
                                        className={
                                            stagePagination[currentStage] ===
                                            totalPages - 1
                                                ? 'pointer-events-none opacity-50 text-primaryColor'
                                                : 'text-primaryColor hover:text-primaryColor'
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </main>
        </div>
    );
}
