export function MissingFieldError() {
    return (
        <p className="text-tertiarySize text-red-400 p-0">
            Please fill out this field.
        </p>
    );
}

export function MaximumLengthReachedError() {
    return (
        <p className="text-tertiarySize text-red-400 p-0">
            You have reached the maximum length.
        </p>
    );
}

export function AIResponseError() {
    return (
        <p className="text-tertiarySize text-red-400 p-0">
            An error occured. Please try again.
        </p>
    );
}