export function parseKeywordString(keywordString: string) {
    try {
        const keywords = JSON.parse(keywordString);
        if (Array.isArray(keywords)) {
            return keywords;
        } else {
            throw new Error('Parsed value is not an array');
        }
    } catch (error) {
        console.error('Failed to parse keyword string:', (error as Error).message);
        return [];
    }
}

export function isValidKeywordJsonString(input: string) {
    // Step 1: Quick structural check
    if (typeof input !== 'string') return false;
    if (!input.trim().startsWith('[') || !input.trim().endsWith(']')) return false;

    try {
        // Step 2: Try parsing the string
        const parsed = JSON.parse(input);

        // Step 3: Check if it's an array of strings
        if (!Array.isArray(parsed)) return false;

        // Step 4: Ensure every element is a string
        return parsed.every(item => typeof item === 'string');
    } catch (e) {
        // JSON parse failed
        return false;
    }
}