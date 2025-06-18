'use client';

import {
    CommentLead,
    PostLead,
    Products,
    LeadStage,
    Bookmark,
    Collection,
} from '@/types/backend/db';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { RedditCommentLeadCard, RedditPostLeadCard } from '../ui/lead/card';
import { isPostLead } from '@/util/utils';
import { useLeads } from '@/lib/frontend/hooks/useLeads';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
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
import {
    BiBookmark,
    BiBookmarks,
    BiCheckCircle,
    BiErrorCircle,
    BiFolder,
    BiPlus,
} from 'react-icons/bi';
import { Badge } from '../ui/badge';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { title } from 'process';
import { MissingFieldError } from '../error/form';
import { useProductBookmarks } from '@/lib/frontend/hooks/useProductBookmarks';
import { useProductCollections } from '@/lib/frontend/hooks/useProductCollections';
import CollectionCreationDialog from '../ui/collection/collectionCreationDialog';
import { DeleteLeadsDialog } from './DeleteLeadsDialog';
import { DeleteAllLeadsDialog } from './DeleteAllLeadsDialog';
import { Trash } from 'lucide-react';

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
    bookmarkID?: string;
    collectionID?: string;
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
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const productURLQuery = searchParams.get('product');
    const bookmarkURLQuery = searchParams.get('bookmark');
    const collectionURLQuery = searchParams.get('collection');
    const [selectedBookmark, setSelectedBoookMark] = useState(
        bookmarkURLQuery || ''
    );
    const [selectedCollection, setSelectedCollection] = useState(
        collectionURLQuery || ''
    );
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(
        fetchedProducts.find((product) => product.id === productURLQuery) ||
            fetchedProducts[0] ||
            null
    );

    const { bookmarks, isBookmarksLoading, refetchAllBookmarks } =
        useProductBookmarks(
            selectedProduct?.id || bookmarkURLQuery || undefined
        );

    const { collections, isCollectionsLoading, refetchAllCollections } =
        useProductCollections(
            selectedProduct?.id || collectionURLQuery || undefined
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

    const [openBookmarkDialogLeadId, setOpenBookmarkDialogLeadId] = useState<
        string | null
    >(null);

    const [openBookmarkCreationDialog, setOpenBookmarkCreationDialog] =
        useState<boolean>(false);
    const [openCollectionCreationDialog, setOpenCollectionCreationDialog] =
        useState<boolean>(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

    const [aiResponses, setAiResponses] = useState<Record<string, string>>({});

    const { leads, totalCount, isLoading, refetchAllLeads } = useLeads(
        selectedProduct ||
            fetchedProducts.find((product) => product.id === productURLQuery) ||
            fetchedProducts[0] ||
            null,
        selectedBookmark,
        options,
        stagePagination[currentStage],
        selectedCollection
    );

    const totalPages = Math.ceil(totalCount / LEADS_PER_PAGE);

    // Handler functions for dialog and AI responses
    function handleOpenDialog(leadId: string) {
        setOpenDialogLeadId(leadId);
    }

    function handleCloseDialog() {
        setOpenDialogLeadId(null);
    }

    function handleOpenBookmarkDialog(leadId: string) {
        setOpenBookmarkDialogLeadId(leadId);
    }

    function handleCloseBookmarkDialog() {
        setOpenBookmarkDialogLeadId(null);
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

    function onSelectedProductChange(productId: string) {
        const product = fetchedProducts.find((p) => p.id === productId);
        if (product) {
            setSelectedProduct(product);
            router.push(`/dashboard/?product=${productId}`);
            setStagePagination({
                identification: 0,
                initial_outreach: 0,
                engagement: 0,
                skipped: 0,
            });
        }
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
        selectedBookmark,
        selectedCollection,
    ]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: [
                'allLeads',
                selectedProduct?.id,
                selectedBookmark,
                selectedCollection,
            ],
        });
    }, [
        selectedBookmark,
        selectedCollection,
        queryClient,
        selectedProduct?.id,
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
                selectedBookmark={selectedBookmark}
                setSelectedBoookMark={setSelectedBoookMark}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                handleStageChange={handleStageChange}
                setOpenBookmarkCreationDialog={setOpenBookmarkCreationDialog}
                setOpenCollectionCreationDialog={
                    setOpenCollectionCreationDialog
                }
                bookmarks={bookmarks || []}
                isBookmarksLoading={isBookmarksLoading}
                collections={collections || []}
                isCollectionsLoading={isCollectionsLoading}
                totalCount={totalCount}
                options={options}
                setOptions={setOptions}
                sortingMethods={sortingMethods}
            />

            <main className="flex-grow">
                <div className="flex items-center justify-between gap-x-4 px-14 py-4">
                    <div className="font-semibold text-primarySize text-secondaryColor">
                        Lead List at {getStageDisplayName(currentStage)} stage:
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash size={14} className="mr-1.5" />
                            Delete Leads
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700"
                            onClick={() => setIsDeleteAllDialogOpen(true)}
                        >
                            <Trash size={14} className="mr-1.5" />
                            Delete All Leads
                        </Button>
                    </div>
                </div>
                <div className="w-full py-4 px-12 pt-1 justify-center grid grid-cols-3 gap-4 min-h-96">
                    {isLoading ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <p className="text-primaryColor">Loading...</p>
                        </div>
                    ) : !leads || leads.length === 0 ? (
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
                        !isLoading &&
                        leads.map((lead, index) => {
                            return isPostLead(lead) ? (
                                <RedditPostLeadCard
                                    leadDetails={lead as PostLead}
                                    key={lead.uniqueID}
                                    selectedProduct={selectedProduct}
                                    isDialogOpen={openDialogLeadId === lead.id}
                                    isBookmarkDialogOpen={
                                        openBookmarkDialogLeadId === lead.id
                                    }
                                    onOpenDialog={() =>
                                        handleOpenDialog(lead.id)
                                    }
                                    onOpenBookmarkDialog={() => {
                                        handleOpenBookmarkDialog(lead.id);
                                    }}
                                    onCloseDialog={handleCloseDialog}
                                    onCloseBookmarkDialog={
                                        handleCloseBookmarkDialog
                                    }
                                    aiResponse={aiResponses[lead.id] || ''}
                                    onSetAiResponse={(response: string) =>
                                        handleSetAiResponse(lead.id, response)
                                    }
                                    onClearAiResponse={() =>
                                        handleClearAiResponse(lead.id)
                                    }
                                    refetchAllLeads={refetchAllLeads}
                                    bookmarks={bookmarks || []}
                                />
                            ) : (
                                <RedditCommentLeadCard
                                    leadDetails={lead as CommentLead}
                                    key={lead.uniqueID}
                                    selectedProduct={selectedProduct}
                                    isDialogOpen={openDialogLeadId === lead.id}
                                    isBookmarkDialogOpen={
                                        openBookmarkDialogLeadId === lead.id
                                    }
                                    onOpenDialog={() =>
                                        handleOpenDialog(lead.id)
                                    }
                                    onOpenBookmarkDialog={() => {
                                        handleOpenBookmarkDialog(lead.id);
                                    }}
                                    onCloseDialog={handleCloseDialog}
                                    onCloseBookmarkDialog={
                                        handleCloseBookmarkDialog
                                    }
                                    aiResponse={aiResponses[lead.id] || ''}
                                    onSetAiResponse={(response: string) =>
                                        handleSetAiResponse(lead.id, response)
                                    }
                                    onClearAiResponse={() =>
                                        handleClearAiResponse(lead.id)
                                    }
                                    refetchAllLeads={refetchAllLeads}
                                    bookmarks={bookmarks || []}
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
            {selectedProduct && (
                <>
                    <RedditBookmarkCreationDialog
                        isOpen={openBookmarkCreationDialog}
                        bookmarks={bookmarks || []}
                        productID={selectedProduct.id}
                        onOpenChange={(open: boolean) =>
                            setOpenBookmarkCreationDialog(open)
                        }
                    />
                    <CollectionCreationDialog
                        isOpen={openCollectionCreationDialog}
                        productID={selectedProduct.id}
                        onOpenChange={(open: boolean) =>
                            setOpenCollectionCreationDialog(open)
                        }
                    />
                </>
            )}

            {selectedProduct && (
                <>
                    <DeleteLeadsDialog
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        productID={selectedProduct.id}
                        onDeleteSuccess={refetchAllLeads}
                    />
                    <DeleteAllLeadsDialog
                        isOpen={isDeleteAllDialogOpen}
                        onOpenChange={setIsDeleteAllDialogOpen}
                        productID={selectedProduct.id}
                        onDeleteSuccess={refetchAllLeads}
                    />
                </>
            )}
        </div>
    );
}

interface RedditLeadBookmarkProps {
    productID: string;
    isOpen: boolean;
    bookmarks: Bookmark[];
    onOpenChange: (open: boolean) => void;
}

export interface BookmarkFormDataTarget extends EventTarget {
    description: { value: string };
    title: { value: string };
}

function RedditBookmarkCreationDialog({
    productID,
    isOpen,
    bookmarks,
    onOpenChange,
}: RedditLeadBookmarkProps) {
    const [bookmarkDetails, setBookmarkDetails] = useState({});
    const { apiPost } = useFetch();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookmarkForm, setBookmarkForm] = useState({
        title: '',
        description: '',
    });
    const [errors, setErrors] = useState({ title: false, description: false });
    async function handleBookmarkSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.target as BookmarkFormDataTarget;
        const title = form.title.value;
        const description = form.description.value;

        const newErrors = {
            description: !description,
            title: !title,
        };

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        if (!hasErrors) {
            try {
                const bookmark = await apiPost('/api/product/bookmark/create', {
                    productID: productID,
                    title: title,
                    description: description,
                });

                queryClient.resetQueries({
                    queryKey: ['productBookmarks', productID],
                });

                toast({
                    title: `Bookmark ${title} Created`,
                    description: `${title} has been added to your Bookmarks List`,
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });

                onOpenChange(false);
                setIsSubmitting(false);
                setBookmarkForm({ title: '', description: '' });
                setErrors({ title: false, description: false });
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

    function handleBoookmarkTitleOnChange(e: ChangeEvent<HTMLInputElement>) {
        setBookmarkForm((prev) => {
            return { ...prev, title: e.target.value };
        });
    }

    function handleBoookmarkDescriptionOnChange(
        e: ChangeEvent<HTMLTextAreaElement>
    ) {
        setBookmarkForm((prev) => {
            return { ...prev, description: e.target.value };
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-6 flex flex-col text-primaryColor">
                <DialogHeader>
                    <div className="font-semibold flex flex-row items-center space-x-1">
                        <BiBookmark size={27} />
                        <div>Bookmark:</div>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleBookmarkSubmit}
                    className="flex flex-col space-y-5"
                >
                    <div className="flex flex-col">
                        <label>Title:</label>
                        <input
                            value={bookmarkForm.title}
                            name="title"
                            placeholder="Bookmark Title"
                            onChange={handleBoookmarkTitleOnChange}
                            className="border border-light p-2 rounded-md"
                            disabled={isSubmitting}
                        />
                        <MissingFieldError trigger={Boolean(errors.title)} />
                    </div>
                    <div className="flex flex-col">
                        <label>Description:</label>
                        <textarea
                            value={bookmarkForm.description}
                            name="description"
                            placeholder="Bookmark Description"
                            onChange={handleBoookmarkDescriptionOnChange}
                            className="border border-light p-2 rounded-md"
                            disabled={isSubmitting}
                        />
                        <MissingFieldError
                            trigger={Boolean(errors.description)}
                        />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button
                            type="submit"
                            variant={'dark'}
                            className="!w-min"
                            disabled={isSubmitting}
                        >
                            Add Bookmark
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
