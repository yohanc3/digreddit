'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../dialog';
import { Label } from '../label';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Badge } from '../badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import {
    productKeywordsMaximumLength,
    productKeywordMinimumLength,
} from '@/lib/frontend/constant/form';
import { prohibitedKeywords } from '@/lib/backend/constant/prohibitedKeywords';
import LightButton from '../../button/light';
import type { Products } from '@/types/backend/db';
import { useProducts } from '@/lib/frontend/hooks/useProducts';
import { useRouter } from 'next/navigation';

interface CriteriaRange {
    label: string;
    points: string;
    description: string;
}

interface CriteriaField {
    id: string;
    maxScore: number;
    description: string;
    ranges: CriteriaRange[];
}

interface EditProductDialogProps {
    productDetails: Products;
    trigger: React.ReactNode;
    onUpdateSuccess?: (updatedProduct: {
        title: string;
        description: string;
        keywords: string[];
    }) => void;
}

export default function EditProductDialog({
    productDetails,
    trigger,
    onUpdateSuccess,
}: EditProductDialogProps) {
    const { apiPost } = useFetch();
    const { refetchAllUserProducts } = useProducts();
    const router = useRouter();

    const [newTitle, setNewTitle] = useState<string>(
        productDetails?.title || ''
    );
    const [newDescription, setNewDescription] = useState<string>(
        productDetails?.description || ''
    );
    const [newKeywords, setNewKeywords] = useState<string[]>(
        (productDetails?.keywords as string[]) || []
    );
    const [currentKeywordInput, setCurrentKeywordInput] = useState<string>('');

    // Lead Evaluation Criteria state
    const [criteriaFields, setCriteriaFields] = useState<CriteriaField[]>([]);

    function calculateRanges(maxScore: number): CriteriaRange[] {
        if (maxScore <= 0) return [];

        const ranges: CriteriaRange[] = [];

        if (maxScore <= 2) {
            // For max 1-2, just individual points
            for (let i = maxScore; i >= 0; i--) {
                ranges.push({
                    label: `${i} ${i === 1 ? 'point' : 'points'}`,
                    points: i.toString(),
                    description: '',
                });
            }
        } else if (maxScore === 3) {
            // For max 3: 3, 2, 1, 0
            ranges.push(
                { label: '3 points', points: '3', description: '' },
                { label: '2 points', points: '2', description: '' },
                { label: '1 point', points: '1', description: '' },
                { label: '0 points', points: '0', description: '' }
            );
        } else {
            // For max 4+: use ranges
            // Highest tier: max points
            ranges.push({
                label: `${maxScore} points`,
                points: maxScore.toString(),
                description: '',
            });

            // Middle tier(s): create ranges
            let remaining = maxScore - 1;
            while (remaining > 1) {
                const rangeStart = Math.max(2, remaining - 1);
                const rangeEnd = remaining;

                if (rangeStart === rangeEnd) {
                    ranges.push({
                        label: `${rangeStart} ${rangeStart === 1 ? 'point' : 'points'}`,
                        points: rangeStart.toString(),
                        description: '',
                    });
                } else {
                    ranges.push({
                        label: `${rangeStart}-${rangeEnd} points`,
                        points: `${rangeStart}-${rangeEnd}`,
                        description: '',
                    });
                }

                remaining = rangeStart - 1;
            }

            // Second-to-lowest tier: 1 point (if not already included)
            if (remaining === 1) {
                ranges.push({
                    label: '1 point',
                    points: '1',
                    description: '',
                });
            }

            // Lowest tier: 0 points
            ranges.push({
                label: '0 points',
                points: '0',
                description: '',
            });
        }

        return ranges;
    }

    // Parse existing criteria on component mount
    function parseCriteriaFromProduct(
        criteriaString: string | null | undefined
    ): CriteriaField[] {
        if (!criteriaString || criteriaString.trim() === '') return [];

        try {
            const parsed = JSON.parse(criteriaString);
            if (!parsed.criteria || !Array.isArray(parsed.criteria)) return [];

            return parsed.criteria.map((criteria: any, index: number) => ({
                id: `existing-${index}-${Date.now()}`,
                maxScore: criteria.max || 0,
                description: criteria.name || '',
                ranges:
                    criteria.ranges?.map((range: any) => ({
                        label: range.pts,
                        points: range.pts,
                        description: range.desc || '',
                    })) || calculateRanges(criteria.max || 0),
            }));
        } catch (error) {
            console.error('Error parsing criteria:', error);
            return [];
        }
    }

    // Initialize criteria fields from existing product data
    useEffect(() => {
        const existingCriteria = parseCriteriaFromProduct(
            productDetails?.criteria
        );
        setCriteriaFields(existingCriteria);
    }, [productDetails?.criteria]);

    function handleKeywordSubmit() {
        const trimmedKeyword = currentKeywordInput.trim();

        if (!trimmedKeyword) return;

        if (prohibitedKeywords.includes(trimmedKeyword.toLowerCase())) {
            toast({
                title: 'Keyword is too common',
                description: 'Please avoid keywords that are too common.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        if (
            newKeywords.length < productKeywordsMaximumLength &&
            trimmedKeyword.length > productKeywordMinimumLength &&
            !newKeywords.includes(trimmedKeyword)
        ) {
            setNewKeywords((prev) => [...prev, trimmedKeyword]);
            setCurrentKeywordInput('');
        } else if (newKeywords.length >= productKeywordsMaximumLength) {
            toast({
                title: 'Maximum keywords reached',
                description: `You can only have up to ${productKeywordsMaximumLength} keywords.`,
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        } else if (newKeywords.includes(trimmedKeyword)) {
            toast({
                title: 'Keyword already exists',
                description: 'This keyword has already been added.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        }
    }

    function handleEnterKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleKeywordSubmit();
        }
    }

    function removeKeyword(keywordToRemove: string) {
        setNewKeywords((prev) =>
            prev.filter((keyword) => keyword !== keywordToRemove)
        );
    }

    // Criteria management functions
    function addCriteriaField() {
        const totalPoints = getTotalPoints();
        const remainingPoints = 10 - totalPoints;

        if (remainingPoints <= 0) {
            toast({
                title: 'Maximum points reached',
                description: 'All criteria points must sum to exactly 10.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        const newMaxScore = Math.min(remainingPoints, 5);
        const newCriteria: CriteriaField = {
            id: Date.now().toString(),
            maxScore: newMaxScore,
            description: '',
            ranges: calculateRanges(newMaxScore),
        };

        setCriteriaFields((prev) => [...prev, newCriteria]);
    }

    function removeCriteriaField(id: string) {
        setCriteriaFields((prev) =>
            prev.filter((criteria) => criteria.id !== id)
        );
    }

    function updateCriteriaMaxScore(id: string, newMaxScore: number) {
        const totalPointsWithoutThis =
            getTotalPoints() -
            (criteriaFields.find((c) => c.id === id)?.maxScore || 0);
        const maxAllowed = 10 - totalPointsWithoutThis;

        if (newMaxScore > maxAllowed) {
            toast({
                title: 'Invalid point allocation',
                description: `Maximum ${maxAllowed} points available for this criteria.`,
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        setCriteriaFields((prev) =>
            prev.map((criteria) => {
                if (criteria.id === id) {
                    return {
                        ...criteria,
                        maxScore: newMaxScore,
                        ranges: calculateRanges(newMaxScore),
                    };
                }
                return criteria;
            })
        );
    }

    function updateCriteriaDescription(id: string, description: string) {
        const wordCount = description
            .split(' ')
            .filter((w: string) => w.trim()).length;
        const charCount = description.length;

        if (wordCount > 20) {
            toast({
                title: 'Description too long',
                description:
                    'Maximum 20 words allowed for criteria description.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        if (charCount > 110) {
            toast({
                title: 'Description too long',
                description:
                    'Maximum 110 characters allowed for criteria description.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        setCriteriaFields((prev) =>
            prev.map((criteria) =>
                criteria.id === id ? { ...criteria, description } : criteria
            )
        );
    }

    function updateRangeDescription(
        id: string,
        rangeIndex: number,
        value: string
    ) {
        const wordCount = value
            .split(' ')
            .filter((w: string) => w.trim()).length;
        const charCount = value.length;

        if (wordCount > 20) {
            toast({
                title: 'Score guideline too long',
                description: 'Maximum 20 words allowed for score guidelines.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        if (charCount > 110) {
            toast({
                title: 'Score guideline too long',
                description:
                    'Maximum 110 characters allowed for score guidelines.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
            return;
        }

        setCriteriaFields((prev) =>
            prev.map((criteria) => {
                if (criteria.id === id) {
                    const updatedRanges = [...criteria.ranges];
                    updatedRanges[rangeIndex] = {
                        ...updatedRanges[rangeIndex],
                        description: value,
                    };
                    return {
                        ...criteria,
                        ranges: updatedRanges,
                    };
                }
                return criteria;
            })
        );
    }

    function getTotalPoints() {
        return criteriaFields.reduce(
            (total, criteria) => total + criteria.maxScore,
            0
        );
    }

    function generateCriteriaString() {
        if (criteriaFields.length === 0) return '';

        // Create compact range-based format for API efficiency
        const compactCriteria = criteriaFields.map((criteria, index) => ({
            name: criteria.description || `Criteria ${index + 1}`,
            max: criteria.maxScore,
            ranges: criteria.ranges.map((range) => ({
                pts: range.points,
                desc: range.description || `${range.label} description needed`,
            })),
        }));

        return JSON.stringify({
            criteria: compactCriteria,
            total: getTotalPoints(),
        });
    }

    async function handleSaveChanges() {
        try {
            const criteriaString = generateCriteriaString();

            const { status } = await apiPost('api/product/update', {
                productID: productDetails?.id,
                title: newTitle,
                description: newDescription,
                keywords: newKeywords,
                leadEvaluationCriteria: criteriaFields,
                criteria: criteriaString,
            });

            if (status === 200) {
                // Call the optional callback for local state updates
                if (onUpdateSuccess) {
                    onUpdateSuccess({
                        title: newTitle,
                        description: newDescription,
                        keywords: newKeywords,
                    });
                }

                // Refresh the page to show the updated product
                refetchAllUserProducts();

                // Refresh router to update left sidebar products list
                router.refresh();

                // Show a success toast
                toast({
                    title: 'Product Successfully Updated!',
                    description:
                        'Changes will be reflected in new leads in 5-10 minutes',
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });
            }
        } catch (error) {
            toast({
                title: 'Error updating product',
                description: 'Please try again later.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        }
    }

    const totalPoints = getTotalPoints();
    const isPointsValid = totalPoints === 10;

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-primaryColor mb-2">
                            Edit Product Details
                        </h2>
                        <p className="text-sm text-gray-600">
                            Make changes to your product information below.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Product Name
                            </Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full"
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                                className="w-full min-h-32 resize-y"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Keywords Section */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">
                                Keywords
                            </Label>

                            {/* Keywords Input */}
                            <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        value={currentKeywordInput}
                                        onChange={(e) =>
                                            setCurrentKeywordInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={handleEnterKeyPress}
                                        className="flex-1"
                                        placeholder="e.g., Tax, Sports, or Law"
                                    />
                                    <LightButton
                                        title="Add Keyword"
                                        onClick={handleKeywordSubmit}
                                        className="px-4 rounded-full p-[-4px]"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Hit enter or click "Add Keyword" to add the
                                    keyword
                                </p>
                            </div>

                            {/* Keywords Display */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 min-h-12 p-3 border rounded-md bg-gray-50">
                                    {newKeywords.length > 0 ? (
                                        newKeywords.map((keyword, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs py-1 px-2 flex items-center gap-1"
                                            >
                                                {keyword}
                                                <X
                                                    size={12}
                                                    className="cursor-pointer text-red-400 hover:text-red-600"
                                                    onClick={() =>
                                                        removeKeyword(keyword)
                                                    }
                                                />
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            No keywords added yet
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {newKeywords.length}/
                                    {productKeywordsMaximumLength} keywords
                                </p>
                            </div>
                        </div>

                        {/* Lead Evaluation Criteria Section */}
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Lead Evaluation Criteria
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Define scoring criteria for evaluating
                                        leads (must total 10 points)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                            isPointsValid
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {!isPointsValid && (
                                            <AlertCircle size={12} />
                                        )}
                                        {totalPoints}/10 points
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCriteriaField}
                                        disabled={totalPoints >= 10}
                                        className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={12} />
                                        Add Criteria
                                    </button>
                                </div>
                            </div>

                            {/* Criteria Fields */}
                            {criteriaFields.length > 0 && (
                                <div className="space-y-4">
                                    {criteriaFields.map((criteria, index) => (
                                        <div
                                            key={criteria.id}
                                            className="border rounded-lg p-4 bg-white shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Criteria {index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCriteriaField(
                                                            criteria.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            {/* Max Score and Description */}
                                            <div className="grid grid-cols-12 gap-3 mb-4">
                                                <div className="col-span-2">
                                                    <Label className="text-xs text-gray-600">
                                                        Max Score
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            10 -
                                                            (totalPoints -
                                                                criteria.maxScore)
                                                        }
                                                        value={
                                                            criteria.maxScore
                                                        }
                                                        onChange={(e) =>
                                                            updateCriteriaMaxScore(
                                                                criteria.id,
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 1
                                                            )
                                                        }
                                                        className="text-center font-medium"
                                                    />
                                                </div>
                                                <div className="col-span-10">
                                                    <Label className="text-xs text-gray-600">
                                                        Description (max 20
                                                        words, 110 characters)
                                                    </Label>
                                                    <Input
                                                        value={
                                                            criteria.description
                                                        }
                                                        onChange={(e) =>
                                                            updateCriteriaDescription(
                                                                criteria.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="What does this criteria evaluate?"
                                                        className="text-sm"
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {
                                                            criteria.description
                                                                .split(' ')
                                                                .filter((w) =>
                                                                    w.trim()
                                                                ).length
                                                        }
                                                        /20 words •{' '}
                                                        {
                                                            criteria.description
                                                                .length
                                                        }
                                                        /110 characters
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Range Description */}
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-600 font-medium">
                                                    Scoring Guidelines
                                                </Label>
                                                <div className="grid gap-2">
                                                    {criteria.ranges.map(
                                                        (range, index) => (
                                                            <div
                                                                key={index}
                                                                className="grid grid-cols-12 gap-3 items-center"
                                                            >
                                                                <div className="col-span-2">
                                                                    <div
                                                                        className={`px-2 py-1 rounded-md text-xs font-medium text-center ${
                                                                            index ===
                                                                            0
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : index ===
                                                                                    criteria
                                                                                        .ranges
                                                                                        .length -
                                                                                        1
                                                                                  ? 'bg-red-100 text-red-700'
                                                                                  : 'bg-blue-100 text-blue-700'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            range.label
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-10">
                                                                    <Input
                                                                        value={
                                                                            range.description
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateRangeDescription(
                                                                                criteria.id,
                                                                                index,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder={`What qualifies for ${range.points}? (max 20 words, 110 chars)`}
                                                                        className="text-sm"
                                                                    />
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {
                                                                            range.description
                                                                                .split(
                                                                                    ' '
                                                                                )
                                                                                .filter(
                                                                                    (
                                                                                        w
                                                                                    ) =>
                                                                                        w.trim()
                                                                                )
                                                                                .length
                                                                        }
                                                                        /20
                                                                        words •{' '}
                                                                        {
                                                                            range
                                                                                .description
                                                                                .length
                                                                        }
                                                                        /110
                                                                        characters
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {criteriaFields.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <div className="text-gray-400 mb-2">
                                        <AlertCircle
                                            size={24}
                                            className="mx-auto"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {productDetails?.criteria &&
                                        productDetails.criteria.trim() !== ''
                                            ? 'Previous criteria could not be loaded'
                                            : 'No evaluation criteria defined yet'}
                                    </p>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Create scoring criteria to automatically
                                        evaluate leads (must total 10 points)
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addCriteriaField}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {productDetails?.criteria &&
                                        productDetails.criteria.trim() !== ''
                                            ? 'Create new criteria'
                                            : 'Add your first criteria'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <DialogClose asChild>
                            {/* Save Button */}
                            <div className="flex justify-end pt-4 border-t">
                                <LightButton
                                    title="Save Changes"
                                    onClick={
                                        criteriaFields.length > 0 &&
                                        !isPointsValid
                                            ? undefined
                                            : handleSaveChanges
                                    }
                                    className={`px-8 rounded-full ${
                                        criteriaFields.length > 0 &&
                                        !isPointsValid
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                />
                            </div>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
