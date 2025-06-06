import { useState } from 'react';
import { Button } from '@/lib/components/ui/button';
import { Label } from '@/lib/components/ui/label';
import { Input } from '@/lib/components/ui/input';
import { Checkbox } from '@/lib/components/ui/checkbox';
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/select';
import { LeadOptions } from '@/lib/components/dashboard/DashboardHandler';
import clsx from 'clsx';

interface LeadFiltersConfigProps {
    className?: string;
    options: LeadOptions;
    setOptions: (options: LeadOptions) => void;
    sortingMethods: Array<{ value: string; label: string }>;
}

export default function LeadFiltersConfig({
    className,
    options,
    setOptions,
    sortingMethods,
}: LeadFiltersConfigProps) {
    const [showLeadFilters, setShowLeadFilters] = useState(false);

    return (
        <div className={clsx('p-4 w-full flex flex-col gap-y-2', className)}>
            <div className="flex items-center gap-x-5">
                <p className="font-semibold text-secondaryColor text-primarySize">
                    Leads Filters Settings:
                </p>
                <Button
                    variant={'light'}
                    onClick={() => setShowLeadFilters(!showLeadFilters)}
                    className="px-8 !h-7"
                >
                    {showLeadFilters ? 'Hide' : 'Show'}
                </Button>
            </div>
            {showLeadFilters && (
                <div className="flex border border-light rounded-md">
                    <div className="flex flex-col p-4 gap-y-2 justify-center border-r border-light w-1/3">
                        <Label className="text-primarySize">
                            Minimum lead rating
                        </Label>
                        <Input
                            type="number"
                            min={5}
                            max={10}
                            value={options.minRating}
                            step={1}
                            className="w-24"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (
                                    !isNaN(value) &&
                                    value >= 1 &&
                                    value <= 10
                                ) {
                                    setOptions({
                                        ...options,
                                        minRating: value as
                                            | 5
                                            | 6
                                            | 7
                                            | 8
                                            | 9
                                            | 10,
                                    });
                                }
                            }}
                        />
                    </div>
                    <div className="flex flex-col p-4 gap-y-2 justify-center border-r border-light w-1/3">
                        <Label className="text-primarySize">
                            Sorting method
                        </Label>

                        <Select
                            value={options.sortingMethod}
                            onValueChange={(value) => {
                                setOptions({
                                    ...options,
                                    sortingMethod: value as
                                        | 'newest'
                                        | 'oldest'
                                        | 'most-upvotes'
                                        | 'least-upvotes',
                                });
                            }}
                        >
                            <SelectContent>
                                {sortingMethods.map((method) => (
                                    <SelectItem
                                        key={method.value}
                                        value={method.value}
                                    >
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sorting method" />
                            </SelectTrigger>
                        </Select>
                    </div>
                    <div className="flex flex-col px-4 gap-y-2 justify-center">
                        <div className="flex items-center gap-x-2">
                            <Checkbox
                                checked={options.showOnlyUninteracted}
                                onCheckedChange={() => {
                                    setOptions({
                                        ...options,
                                        showOnlyUninteracted:
                                            !options.showOnlyUninteracted,
                                    });
                                }}
                            />
                            <Label className="text-primarySize">
                                Show only leads you have not interacted with
                            </Label>
                        </div>
                        <Label className="text-xs text-muted-foreground ">
                            To interact with a lead, simply open the original
                            comment/post through the "Open" or "View Comment"
                            button.
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
}
