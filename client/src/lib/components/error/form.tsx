import { productKeywordMaximumLength } from '@/lib/frontend/constant/form';

import { productKeywordMinimumLength } from '@/lib/frontend/constant/form';

interface formErrorComponentProps {
    trigger: boolean;
}

export function MissingFieldError({
    trigger = false,
}: formErrorComponentProps) {
    return (
        trigger &&
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                Please fill out this field.
            </p>
        )
    );
}

export function MaximumLengthReachedError({
    trigger = false,
}: formErrorComponentProps) {
    return (
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                You have reached the maximum length.
            </p>
        )
    );
}

export function AIResponseError({ trigger = false }: formErrorComponentProps) {
    return (
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                An error occured. Please try again.
            </p>
        )
    );
}

export function MaximumWordsReachedError({
    trigger = false,
}: formErrorComponentProps) {
    return (
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                You have reached the maximum allowed number of words
            </p>
        )
    );
}

export function MaximumCharactersReachedError({
    trigger = false,
}: formErrorComponentProps) {
    return (
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                You have reached the maximum allowed number of characters (
                {productKeywordMaximumLength})
            </p>
        )
    );
}

export function MinimumCharactersReachedError({
    trigger = false,
}: formErrorComponentProps) {
    return (
        trigger && (
            <p className="text-tertiarySize text-red-400 p-0">
                You have not reached the minimum allowed number of characters (
                {productKeywordMinimumLength})
            </p>
        )
    );
}
