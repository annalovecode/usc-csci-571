export const isNonEmptyString = (value: any): boolean => value && typeof value === 'string' && (value as string).trim().length > 0;

export const isNonEmptyArray = (value: any): boolean => Array.isArray(value) && (value as any[]).length > 0;

export const isNumber = (value: any): boolean => typeof value === "number";
