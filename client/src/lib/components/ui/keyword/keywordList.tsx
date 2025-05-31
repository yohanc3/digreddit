import { X } from 'lucide-react';
import { Badge } from '../badge';
import KeywordsListLoading from './keywordsListLoading';
import clsx from 'clsx';
import {
    ProductFormDataFields,
    ProductFormInputFields,
} from '@/types/frontend/product/form';
import { SetStateAction } from 'react';
import { productKeywordsMaximumLength } from '@/lib/frontend/constant/form';

type KeywordsListProps = {
    keywords: string[];
    isLoading: boolean;
    setValue: React.Dispatch<SetStateAction<ProductFormDataFields>>;
};

export default function KeywordsList({
    keywords,
    isLoading = false,
    setValue,
}: KeywordsListProps) {
    return (
        <div className="space-y-2">
            {/* Keywords Counter */}
            <div className="flex justify-between items-center">
                {keywords.length >= productKeywordsMaximumLength && (
                    <p className="text-xs text-red-500">
                        Maximum keywords reached
                    </p>
                )}
            </div>

            {/* Keywords List */}
            <div
                className={clsx(
                    'flex flex-wrap gap-1.5 w-full overflow-y-auto min-h-12 p-3 border rounded-md bg-gray-50'
                )}
            >
                {!isLoading ? (
                    keywords.length > 0 ? (
                        keywords.map((item: string, index: number) => (
                            <Badge
                                key={index}
                                variant={'leadKeyword'}
                                className="text-xs py-0.5 px-2 cursor-pointer transition-colors duration-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200 select-none"
                                onClick={() =>
                                    setValue((prev) => ({
                                        ...prev,
                                        keywords: prev.keywords.filter(
                                            (keyword) => item != keyword
                                        ),
                                    }))
                                }
                                title={`Click to remove "${item}"`}
                            >
                                {item}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">
                            No keywords added yet
                        </p>
                    )
                ) : (
                    <KeywordsListLoading />
                )}
            </div>
        </div>
    );
}
