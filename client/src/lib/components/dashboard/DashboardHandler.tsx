'use client';

import { CommentLead, PostLead, Products, LeadStage } from '@/types/backend/db';
import { useEffect, useState } from 'react';
import {
    LeftSideBarLeadResult,
    RightSideBarLeadResult,
} from '../ui/lead/sidebar';
import { RedditCommentLeadCard, RedditPostLeadCard } from '../ui/lead/card';
import ProductConfig from '../ui/lead/productConfig';
import LeadFiltersConfig from '../ui/lead/leadFiltersConfig';
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
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '../ui/menubar';
import { ChevronDown } from 'lucide-react';
import { HelpCircle } from 'lucide-react';

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
        fetchedProducts[0]
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
        <>
            <LeftSideBarLeadResult
                products={fetchedProducts}
                onSelectedProductChange={onSelectedProductChange}
            />

            <div className="w-2/3">
                <ProductConfig
                    productDetails={selectedProduct}
                    className="border-b border-light"
                />

                <LeadFiltersConfig
                    options={options}
                    setOptions={setOptions}
                    sortingMethods={sortingMethods}
                    className="border-b border-light"
                />

                <div className="flex justify-between items-center p-4">
                    <div className="font-semibold text-primarySize text-secondaryColor">
                        Lead List at {getStageDisplayName(currentStage)} stage:
                    </div>
                    <div className="flex items-center gap-x-3">
                        {/* Help Button with Tooltip */}
                        <div className="relative group">
                            <button
                                className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                                aria-label="Help information about lead stages"
                            >
                                <HelpCircle
                                    size={14}
                                    className="text-gray-500"
                                />
                            </button>

                            {/* Tooltip */}
                            <div className="absolute right-0 top-8 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 text-sm">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-1">
                                                Lead Stages:
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                Organize your leads by
                                                interaction level
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-primaryColor font-semibold text-sm">
                                                    1. Identification:
                                                </span>
                                                <div className="text-gray-600 text-xs">
                                                    Newly discovered leads that
                                                    match your keywords
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-primaryColor font-semibold text-sm">
                                                    2. Initial Outreach:
                                                </span>
                                                <div className="text-gray-600 text-xs">
                                                    Leads you've contacted for
                                                    the first time
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-primaryColor font-semibold text-sm">
                                                    3. Engagement:
                                                </span>
                                                <div className="text-gray-600 text-xs">
                                                    Active conversations and
                                                    relationship building
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                            Use the stage buttons on lead cards
                                            to move them through your sales
                                            process
                                        </div>
                                    </div>

                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-0 right-4 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200"></div>
                                    <div className="absolute top-0 right-4 transform -translate-y-1 translate-x-0 translate-y-px w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                                </div>
                            </div>
                        </div>

                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-medium cursor-pointer flex items-center gap-x-2">
                                    {getStageDisplayName(currentStage)} (
                                    {totalCount})
                                    <ChevronDown size={16} />
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem
                                        onClick={() =>
                                            handleStageChange('identification')
                                        }
                                    >
                                        Identification
                                    </MenubarItem>
                                    <MenubarItem
                                        onClick={() =>
                                            handleStageChange(
                                                'initial_outreach'
                                            )
                                        }
                                    >
                                        Initial Outreach
                                    </MenubarItem>
                                    <MenubarItem
                                        onClick={() =>
                                            handleStageChange('engagement')
                                        }
                                    >
                                        Engagement
                                    </MenubarItem>
                                    <MenubarItem
                                        onClick={() =>
                                            handleStageChange('skipped')
                                        }
                                    >
                                        Skipped
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
                <div className="w-full p-4 pt-1 justify-center grid grid-cols-3 gap-2 min-h-96">
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
            </div>

            <RightSideBarLeadResult
                productID={selectedProduct?.id}
                productTitle={selectedProduct?.title}
            />
        </>
    );
}
