import { Responses } from '../types';

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';

    return input
        .trim()
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

/**
 * Sanitize all responses
 */
export const sanitizeResponses = (responses: Partial<Responses>): Partial<Responses> => {
    const sanitized: Partial<Responses> = {};

    Object.keys(responses).forEach((key) => {
        const typedKey = key as keyof Responses;
        const value = responses[typedKey];

        if (typeof value === 'string') {
            sanitized[typedKey] = sanitizeInput(value) as Responses[keyof Responses];
        } else if (Array.isArray(value)) {
            sanitized[typedKey] = cleanArray(value) as Responses[keyof Responses];
        } else {
            sanitized[typedKey] = value as Responses[keyof Responses];
        }
    });

    return sanitized;
};
