'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { toast } from '@/hooks/use-toast';
import { LeadFilters, LeadStage } from '@/types/backend/db';
import { Checkbox } from '../ui/checkbox';

interface DeleteLeadsDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    productID: string;
    onDeleteSuccess: () => void;
}

const leadStages: LeadStage[] = [
    'identification',
    'initial_outreach',
    'engagement',
    'skipped',
];

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
            return 'Unknown Stage';
    }
};

export function DeleteLeadsDialog({
    isOpen,
    onOpenChange,
    productID,
    onDeleteSuccess,
}: DeleteLeadsDialogProps) {
    const [filters, setFilters] = useState<LeadFilters>({});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setFilters({});
    }, [isOpen]);

    async function handleDeleteLeads() {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/leads/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productID, filters }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete leads.');
            }

            toast({
                title: 'Success',
                description: 'Leads have been deleted successfully.',
            });
            onDeleteSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description:
                    'An error occurred while deleting leads. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-semibold">
                        Delete Leads
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        This will permanently delete leads based on the selected
                        filters. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="minRating"
                                className="text-sm font-medium text-gray-700"
                            >
                                Maximum Rating
                            </Label>
                            <div className="w-32">
                                <Select
                                    onValueChange={(value: string) =>
                                        setFilters((f) => ({
                                            ...f,
                                            minRating: parseInt(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Any" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(
                                            { length: 5 },
                                            (_, i) => i + 6
                                        ).map((i) => (
                                            <SelectItem
                                                key={i}
                                                value={String(i)}
                                            >
                                                {i}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Deletes all leads with a rating of this value or
                            lower
                        </p>
                    </div>

                    <div className="">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="maxAgeDays"
                                className="text-sm font-medium text-gray-700"
                            >
                                Older Than (days)
                            </Label>
                            <div className="w-32">
                                <Input
                                    id="maxAgeDays"
                                    type="number"
                                    placeholder="e.g., 30"
                                    min={0}
                                    className="h-9"
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFilters((f) => ({
                                            ...f,
                                            maxAgeDays: e.target.value
                                                ? parseInt(e.target.value)
                                                : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Deletes all leads older than the specified number of
                            days
                        </p>
                    </div>

                    <div className="">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="stage"
                                className="text-sm font-medium text-gray-700"
                            >
                                Stage
                            </Label>
                            <div className="w-32">
                                <Select
                                    onValueChange={(value: LeadStage | 'all') =>
                                        setFilters((f) => ({
                                            ...f,
                                            stage:
                                                value === 'all'
                                                    ? undefined
                                                    : value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Any" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any</SelectItem>
                                        {leadStages.map((stage) => (
                                            <SelectItem
                                                key={stage}
                                                value={stage}
                                            >
                                                {getStageDisplayName(stage)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Only delete leads that are in the selected stage
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 pt-6 border-t">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="flex-1 text-primaryColor text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteLeads}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
