'use client';

import { useState } from 'react';
import { Label } from '../label';
import { Input } from '../input';
import { X, Plus, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BiErrorCircle, BiBot } from 'react-icons/bi';
import { calculateRanges } from '@/lib/frontend/utils/criteriaParser';
import AICriteriaDialog from './AICriteriaDialog';

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

interface CriteriaBuilderProps {
    /**
     * Current criteria fields state
     */
    criteriaFields: CriteriaField[];

    /**
     * Function to update criteria fields
     */
    setCriteriaFields: React.Dispatch<React.SetStateAction<CriteriaField[]>>;

    /**
     * Product ID for AI generation (optional for new products)
     */
    productID?: string;

    /**
     * Product description for AI generation validation
     */
    productDescription?: string;

    /**
     * Whether the component is in a creation context (affects AI dialog behavior)
     */
    isCreationMode?: boolean;

    /**
     * Whether the form is currently submitting (disables interactions)
     */
    isSubmitting?: boolean;
}

/**
 * Reusable component for building and managing lead evaluation criteria.
 * Supports adding, editing, and removing criteria with scoring ranges.
 * Includes AI-powered criteria generation.
 */
export default function CriteriaBuilder({
    criteriaFields,
    setCriteriaFields,
    productID = '',
    productDescription = '',
    isCreationMode = false,
    isSubmitting = false,
}: CriteriaBuilderProps) {
    /**
     * Calculates the total points across all criteria fields
     */
    function getTotalPoints(): number {
        return criteriaFields.reduce(
            (total, criteria) => total + criteria.maxScore,
            0
        );
    }

    /**
     * Adds a new criteria field with appropriate point allocation
     */
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

    /**
     * Removes a criteria field by ID
     */
    function removeCriteriaField(id: string) {
        setCriteriaFields((prev) =>
            prev.filter((criteria) => criteria.id !== id)
        );
    }

    /**
     * Updates the maximum score for a criteria field
     */
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

    /**
     * Updates the description for a criteria field with validation
     */
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

    /**
     * Updates the description for a specific scoring range with validation
     */
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

    /**
     * Handles AI-generated criteria by replacing current criteria
     */
    function handleAICriteriaGenerated(newCriteria: CriteriaField[]) {
        setCriteriaFields(newCriteria);
    }

    const totalPoints = getTotalPoints();
    const isPointsValid = totalPoints === 10;

    return (
        <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-medium">
                        Lead Evaluation Criteria
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                        Define scoring criteria for evaluating leads (must total
                        10 points)
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
                        {!isPointsValid && <AlertCircle size={12} />}
                        {totalPoints}/10 points
                    </div>
                    <AICriteriaDialog
                        productID={productID}
                        onCriteriaGenerated={handleAICriteriaGenerated}
                        productDescription={productDescription}
                        onCriteriaCallback={setCriteriaFields}
                        isCreationMode={isCreationMode}
                        trigger={
                            <button
                                type="button"
                                disabled={
                                    !productDescription?.trim() || isSubmitting
                                }
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-blue-300 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                    !productDescription?.trim()
                                        ? 'Add a product description first'
                                        : 'Generate AI criteria'
                                }
                            >
                                <BiBot size={14} />
                                AI Generate
                            </button>
                        }
                    />
                    <button
                        type="button"
                        onClick={addCriteriaField}
                        disabled={totalPoints >= 10 || isSubmitting}
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
                                        removeCriteriaField(criteria.id)
                                    }
                                    disabled={isSubmitting}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
                                            (totalPoints - criteria.maxScore)
                                        }
                                        value={criteria.maxScore}
                                        onChange={(e) =>
                                            updateCriteriaMaxScore(
                                                criteria.id,
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        disabled={isSubmitting}
                                        className="text-center font-medium"
                                    />
                                </div>
                                <div className="col-span-10">
                                    <Label className="text-xs text-gray-600">
                                        Description (max 20 words, 110
                                        characters)
                                    </Label>
                                    <Input
                                        value={criteria.description}
                                        onChange={(e) =>
                                            updateCriteriaDescription(
                                                criteria.id,
                                                e.target.value
                                            )
                                        }
                                        disabled={isSubmitting}
                                        placeholder="What does this criteria evaluate?"
                                        className="text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {
                                            criteria.description
                                                .split(' ')
                                                .filter((w) => w.trim()).length
                                        }
                                        /20 words •{' '}
                                        {criteria.description.length}/110
                                        characters
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
                                        (range, rangeIndex) => (
                                            <div
                                                key={rangeIndex}
                                                className="grid grid-cols-12 gap-3 items-center"
                                            >
                                                <div className="col-span-2">
                                                    <div
                                                        className={`px-2 py-1 rounded-md text-xs font-medium text-center ${
                                                            rangeIndex === 0
                                                                ? 'bg-green-100 text-green-700'
                                                                : rangeIndex ===
                                                                    criteria
                                                                        .ranges
                                                                        .length -
                                                                        1
                                                                  ? 'bg-red-100 text-red-700'
                                                                  : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    >
                                                        {range.label}
                                                    </div>
                                                </div>
                                                <div className="col-span-10">
                                                    <Input
                                                        value={
                                                            range.description
                                                        }
                                                        onChange={(e) =>
                                                            updateRangeDescription(
                                                                criteria.id,
                                                                rangeIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={isSubmitting}
                                                        placeholder={`What qualifies for ${range.points}? (max 20 words, 110 chars)`}
                                                        className="text-sm"
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {
                                                            range.description
                                                                .split(' ')
                                                                .filter((w) =>
                                                                    w.trim()
                                                                ).length
                                                        }
                                                        /20 words •{' '}
                                                        {
                                                            range.description
                                                                .length
                                                        }
                                                        /110 characters
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
                        <AlertCircle size={24} className="mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                        No evaluation criteria defined yet
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                        Create scoring criteria to automatically evaluate leads
                        (must total 10 points)
                    </p>
                    <AICriteriaDialog
                        productID={productID}
                        onCriteriaGenerated={handleAICriteriaGenerated}
                        productDescription={productDescription}
                        onCriteriaCallback={setCriteriaFields}
                        isCreationMode={isCreationMode}
                        trigger={
                            <button
                                type="button"
                                disabled={
                                    !productDescription?.trim() || isSubmitting
                                }
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                    !productDescription?.trim()
                                        ? 'Add a product description first'
                                        : 'Generate AI criteria'
                                }
                            >
                                Generate your first criteria with AI
                            </button>
                        }
                    />
                </div>
            )}
        </div>
    );
}
