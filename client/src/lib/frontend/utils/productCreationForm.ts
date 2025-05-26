import {
    ProductFormDataError,
    ProductFormDataFields,
} from '@/types/frontend/product/form';
import { ChangeEvent } from 'react';
import {
    productDescriptionMaximumWords,
    productIndustryMaximumCharacters,
    productKeywordMaximumLength,
    productKeywordMinimumLength,
    productMRRMaximumCharacters,
    productNameMaximumCharacters,
} from '../constant/form';

export function countWords(paragraph: string): number {
    const wordsArray = paragraph
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
    return wordsArray.length;
}

export function isMaximumWordsReached(
    paragraph: string,
    limit: number
): boolean {
    return countWords(paragraph) >= limit;
}

export function isMaximumCharactersReached(
    text: string,
    limit: number
): boolean {
    return text.length >= limit;
}

export function isMinimumCharactersReached(
    text: string,
    limit: number
): boolean {
    return text.length < limit && text.length > 0;
}

export function handleMRRInputOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    const val = event.target.value;
    if (
        /^\d*$/.test(val) &&
        !isMaximumCharactersReached(val, productMRRMaximumCharacters + 1)
    ) {
        setValue((prev) => ({ ...prev, mrr: val }));
        setError({ mrr: false });
    }
}

export function handleURLInputOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    setValue((prev) => ({ ...prev, url: event.target.value }));
    setError({ url: false });
}

export function handleIndustryInputOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    !isMaximumCharactersReached(
        event.target.value,
        productIndustryMaximumCharacters + 1
    ) &&
        setValue((prev) => {
            return { ...prev, industry: event.target.value };
        });
    setError({ industry: false });
}

export function handleTitleInputOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    !isMaximumCharactersReached(
        event.target.value,
        productNameMaximumCharacters + 1
    ) &&
        setValue((prev) => {
            return { ...prev, title: event.target.value };
        });
    setError({ title: false });
}

export function handleDescriptionInputOnChange(
    event: ChangeEvent<HTMLTextAreaElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    !isMaximumWordsReached(
        event.target.value,
        productDescriptionMaximumWords + 1
    ) &&
        setValue((prev) => {
            return { ...prev, description: event.target.value };
        });
    setError({ description: false });
}

export function handleKeywordInputOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<ProductFormDataFields>>,
    setError: (field: ProductFormDataError) => void
) {
    const value = event.target.value;
    if (!isMaximumCharactersReached(value, productKeywordMaximumLength + 1)) {
        setValue((prev) => ({ ...prev, keyword: value }));
        setError({ keyword: false });
    }
}
