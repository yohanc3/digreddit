'use client';

import { ChangeEvent, useState } from 'react';
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
import { toast } from '@/hooks/use-toast';

interface DeleteAllLeadsDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    productID: string;
    onDeleteSuccess: () => void;
}

export function DeleteAllLeadsDialog({
    isOpen,
    onOpenChange,
    productID,
    onDeleteSuccess,
}: DeleteAllLeadsDialogProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDeleteAllLeads() {
        if (confirmationText !== 'delete all') {
            toast({
                title: 'Invalid Confirmation',
                description:
                    'Please type "delete all" to confirm the deletion.',
                variant: 'destructive',
            });
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch('/api/product/delete/all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productID,
                    confirmation: confirmationText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || 'Failed to delete all leads.'
                );
            }

            toast({
                title: 'Success',
                description: 'All leads have been deleted successfully.',
            });
            onDeleteSuccess();
            onOpenChange(false);
            setConfirmationText('');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while deleting all leads. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
        }
    }

    function handleConfirmationChange(e: ChangeEvent<HTMLInputElement>) {
        setConfirmationText(e.target.value);
    }

    function handleDialogClose() {
        setConfirmationText('');
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-semibold text-red-600">
                        Delete All Leads
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-red-600">Warning:</strong> This
                        will permanently delete ALL leads for this product. This
                        action cannot be undone and will remove all leads
                        regardless of their stage, rating, or other properties.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmation"
                            className="text-sm font-medium text-gray-700"
                        >
                            Type "delete all" to confirm this action:
                        </Label>
                        <Input
                            id="confirmation"
                            type="text"
                            placeholder="delete all"
                            value={confirmationText}
                            onChange={handleConfirmationChange}
                            className="border-red-300 focus:border-red-500 focus:ring-red-500"
                            disabled={isDeleting}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-3 pt-6 border-t">
                    <Button
                        variant="secondary"
                        onClick={handleDialogClose}
                        disabled={isDeleting}
                        className="flex-1 text-primaryColor text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAllLeads}
                        disabled={
                            isDeleting || confirmationText !== 'delete all'
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete All Leads'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
