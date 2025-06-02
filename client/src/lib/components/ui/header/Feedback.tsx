'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../dialog';
import { Button } from '../button';
import { Label } from '../label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select';
import { Textarea } from '../textarea';
import { toPascalCasePreserveSymbols } from '@/lib/utils';
import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useFetch } from '@/lib/frontend/hooks/useFetch';

interface FeedbackFormData {
    area: string;
    feedback: string;
}

export function Feedback() {
    const [formData, setFormData] = useState<FeedbackFormData>({
        area: '',
        feedback: '',
    });

    const { apiPost } = useFetch();

    const { mutate: submitFeedback } = useMutation({
        mutationFn: async (formData: FeedbackFormData) => {
            return await apiPost('/api/feedback/create', {
                area: formData.area,
                feedback: formData.feedback,
            });
        },
        onSuccess: () => {
            setFormData({
                area: '',
                feedback: '',
            });
            toast({
                title: 'Feedback submitted',
                description: 'Thank you for your feedback!',
            });
        },
        onError: () => {
            toast({
                title: 'Failed to submit feedback',
                description: 'Please try again later.',
            });
        },
    });

    return (
        <div className="flex flex-row items-center gap-x-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={'light'}
                        className={clsx('border-0 !text-primaryColor')}
                    >
                        Feedback
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Feedback</DialogTitle>
                        <DialogDescription>
                            Help us improve by sharing your feedback
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();

                            await submitFeedback(formData);
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="area">
                                    Area of Improvement
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setFormData({
                                            ...formData,
                                            area: value,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select area" />
                                    </SelectTrigger>
                                    <SelectContent className="cursor-pointer">
                                        {[
                                            'product-creation',
                                            'keywords',
                                            'ai-generation',
                                            'leads-quality',
                                            'leads',
                                            'other',
                                        ].map((item) => (
                                            <SelectItem
                                                key={item}
                                                value={item
                                                    .split('-')
                                                    .join(' ')}
                                                className="cursor-pointer"
                                            >
                                                {toPascalCasePreserveSymbols(
                                                    item.split('-').join(' ')
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="feedback">Your Feedback</Label>
                                <Textarea
                                    id="feedback"
                                    maxLength={120}
                                    placeholder="Please share your feedback (max 120 words)"
                                    className="h-32"
                                    value={formData.feedback}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            feedback: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" variant="dark">
                                Submit Feedback
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
