'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';
import { Label } from '../label';
import { Textarea } from '../textarea';
import { BiBot, BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { toast } from '@/hooks/use-toast';
import LightButton from '../../button/light';

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

interface AICriteriaDialogProps {
    productID?: string;
    trigger: React.ReactNode;
    onCriteriaGenerated: (criteria: CriteriaField[]) => void;
    productDescription?: string;
    onCriteriaCallback?: (criteria: CriteriaField[]) => void;
    isCreationMode?: boolean;
}

export default function AICriteriaDialog({
    productID,
    trigger,
    onCriteriaGenerated,
    productDescription,
    onCriteriaCallback,
    isCreationMode = false,
}: AICriteriaDialogProps) {
    const { apiPost } = useFetch();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [idealCustomer, setIdealCustomer] = useState<string>('');
    const [additionalInstructions, setAdditionalInstructions] =
        useState<string>('');

    async function handleGenerate() {
        if (!productID) return;

        setIsGenerating(true);

        toast({
            title: 'Generating criteria...',
            description:
                'AI is creating evaluation criteria based on your preferences.',
            action: <BiBot color="#576F72" size={35} />,
        });

        try {
            const { status, criteria, success } = await apiPost(
                'api/product/criteria/update',
                {
                    productID,
                    idealCustomer: idealCustomer.trim(),
                    additionalInstructions: additionalInstructions.trim(),
                }
            );

            if (success) {
                // Convert AI response to frontend format
                const aiCriteria = criteria.criteria.map(
                    (criteria: any, index: number) => ({
                        id: `ai-${index}-${Date.now()}`,
                        maxScore: criteria.max,
                        description: criteria.name,
                        ranges: criteria.ranges.map((range: any) => ({
                            label:
                                range.pts === '0'
                                    ? '0 points'
                                    : range.pts.includes('-')
                                      ? `${range.pts} points`
                                      : range.pts === '1'
                                        ? '1 point'
                                        : `${range.pts} points`,
                            points: range.pts,
                            description: range.desc,
                        })),
                    })
                );

                onCriteriaGenerated(aiCriteria);
                setIsOpen(false);

                // Clear form
                setIdealCustomer('');
                setAdditionalInstructions('');

                toast({
                    title: 'AI criteria generated!',
                    description:
                        'Review and customize the generated criteria as needed.',
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });
            } else {
                throw new Error('Failed to generate criteria');
            }
        } catch (error) {
            console.error('Error generating AI criteria:', error);
            toast({
                title: 'Failed to generate criteria',
                description: 'Please try again or create criteria manually.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleGenerateForCreation() {
        if (!productDescription?.trim()) return;

        setIsGenerating(true);

        toast({
            title: 'Generating criteria...',
            description:
                'AI is creating evaluation criteria based on your product description.',
            action: <BiBot color="#576F72" size={35} />,
        });

        try {
            const { status, criteria, success } = await apiPost(
                'api/product/criteria/generate',
                {
                    description: productDescription.trim(),
                    idealCustomer: idealCustomer.trim(),
                    additionalInstructions: additionalInstructions.trim(),
                }
            );

            if (success) {
                // Convert AI response to frontend format
                const aiCriteria = criteria.criteria.map(
                    (criteria: any, index: number) => ({
                        id: `ai-${index}-${Date.now()}`,
                        maxScore: criteria.max,
                        description: criteria.name,
                        ranges: criteria.ranges.map((range: any) => ({
                            label:
                                range.pts === '0'
                                    ? '0 points'
                                    : range.pts.includes('-')
                                      ? `${range.pts} points`
                                      : range.pts === '1'
                                        ? '1 point'
                                        : `${range.pts} points`,
                            points: range.pts,
                            description: range.desc,
                        })),
                    })
                );

                // Use callback for creation mode
                if (onCriteriaCallback) {
                    onCriteriaCallback(aiCriteria);
                }
                setIsOpen(false);

                // Clear form
                setIdealCustomer('');
                setAdditionalInstructions('');

                toast({
                    title: 'AI criteria generated!',
                    description:
                        'Review and customize the generated criteria as needed.',
                    action: <BiCheckCircle color="#576F72" size={35} />,
                });
            } else {
                throw new Error('Failed to generate criteria');
            }
        } catch (error) {
            toast({
                title: 'Failed to generate criteria',
                description:
                    'Please try again. If multiple attempts fail, create criteria manually or contact support.',
                action: <BiErrorCircle color="#f87171" size={35} />,
            });
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <BiBot size={24} className="text-blue-600" />
                            <h2 className="text-xl font-semibold text-primaryColor">
                                AI Criteria Generation
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600">
                            Help us create better lead scoring criteria by
                            sharing a bit about your ideal customers and
                            preferences.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Ideal vs Poor Fit */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                🎯 Ideal vs Poor Fit Customers
                            </Label>
                            <p className="text-xs text-gray-500 mb-2">
                                Describe what makes someone a perfect lead based
                                on a single comment or post, and list any red
                                flags that would indicate a poor fit.
                            </p>
                            <Textarea
                                value={idealCustomer}
                                onChange={(e) =>
                                    setIdealCustomer(e.target.value)
                                }
                                className="min-h-24 resize-y"
                                placeholder="e.g., 'Perfect: Mentions a challenge or frustration with <xyz>, even if vaguely... Red flags: <xyz> is not a problem or a challenge'"
                            />
                            <p className="text-xs text-gray-400">
                                {idealCustomer.length}/500 characters
                            </p>
                        </div>

                        {/* Additional Instructions */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                ✨ Additional Instructions
                            </Label>
                            <p className="text-xs text-gray-500 mb-2">
                                Any other preferences or special considerations
                                for scoring leads?
                            </p>
                            <Textarea
                                value={additionalInstructions}
                                onChange={(e) =>
                                    setAdditionalInstructions(e.target.value)
                                }
                                className="min-h-20 resize-y"
                                placeholder="e.g., Give a higher score to leads that mention urgency, and a lower score to leads that mention budget size..."
                            />
                            <p className="text-xs text-gray-400">
                                {additionalInstructions.length}/300 characters
                            </p>
                        </div>
                    </div>

                    {/* Dialog Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            disabled={isGenerating}
                        >
                            Cancel
                        </button>
                        <LightButton
                            title={
                                isGenerating
                                    ? 'Generating...'
                                    : 'Generate Criteria'
                            }
                            onClick={
                                isCreationMode
                                    ? handleGenerateForCreation
                                    : handleGenerate
                            }
                            className="px-6 rounded-md"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
