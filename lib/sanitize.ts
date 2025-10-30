import DOMPurify from 'dompurify';
import { Responses } from '../types';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

function sanitizeValue<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeInput(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === 'string' ? sanitizeInput(item) : item
    ) as T;
  }

  return value;
}

export function sanitizeResponses<T extends Partial<Responses>>(responses: T): T {
  const sanitizedEntries = Object.entries(responses).reduce<Partial<Responses>>(
    (acc, [key, value]) => {
      acc[key as keyof Responses] = sanitizeValue(value);
      return acc;
    },
    {}
  );

  return sanitizedEntries as T;
}
