import { Responses } from '../types';

/**
 * Sanitize user input to prevent XSS and injection attacks.
 *
 * Note: We intentionally preserve user-entered whitespace so that spaces
 * remain available while someone is typing into any free-text field. This
 * keeps the typing experience natural while still stripping unsafe content.
 */
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';

    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .substring(0, 10000);
};

/**
 * Remove empty strings and null values from arrays
 */
export const cleanArray = (arr: unknown[]): string[] => {
    if (!Array.isArray(arr)) return [];

    return arr
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => String(item).trim())
        .filter(item => item.length > 0);
};

const isStringArrayRecord = (value: unknown): value is Record<string, string[]> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    return Object.values(value).every(item => Array.isArray(item));
};

const sanitizeResponseValue = (value: Responses[keyof Responses]): Responses[keyof Responses] => {
    if (typeof value === 'string') {
        return sanitizeInput(value) as Responses[keyof Responses];
    }

    if (Array.isArray(value)) {
        return cleanArray(value) as Responses[keyof Responses];
    }

    if (isStringArrayRecord(value)) {
        const sanitizedEntries = Object.entries(value).reduce<Record<string, string[]>>((acc, [key, entries]) => {
            const cleaned = cleanArray(entries);
            if (cleaned.length > 0) {
                acc[key] = cleaned;
            }
            return acc;
        }, {});

        return sanitizedEntries as Responses[keyof Responses];
    }

    return value;
};

/**
 * Sanitize all responses
 */
export const sanitizeResponses = (responses?: Partial<Responses>): Partial<Responses> => {
    if (!responses) {
        return {};
    }

    const sanitizedEntries: Partial<Responses> = {};
    const assignable = sanitizedEntries as Record<keyof Responses, Responses[keyof Responses]>;

    (Object.keys(responses) as (keyof Responses)[]).forEach((key) => {
        const value = responses[key];

        if (value === undefined || value === null) {
            return;
        }

        assignable[key] = sanitizeResponseValue(value);
    });

    return sanitizedEntries;
};
