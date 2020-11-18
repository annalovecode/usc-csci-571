import { NotFoundError, BadRequestError } from '../error';
import * as Validator from '../validator';

export const parseString = (value: any): string => {
    if (!Validator.isNonEmptyString(value)) {
        throw new NotFoundError();
    }
    return (value as string).trim();
};

export const parseNumber = (value: any): number => {
    if (!Validator.isNumber(value)) {
        throw new NotFoundError();
    }
    value = value as number;
    if (!Number.isInteger(value)) {
        value = +(value.toFixed(2));
    }
    return value;
};

export const parseOptionalNumber = (value: any): number => {
    if (!Validator.isNumber(value)) {
        return 0;
    }
    value = value as number;
    if (!Number.isInteger(value)) {
        value = +(value.toFixed(2));
    }
    return value;
};


export const parseArray = (value: any): any[] => {
    if (!Array.isArray(value)) {
        throw new NotFoundError(value);
    }
    return value as any[];
};

export const parseNonEmptyArray = (value: any): any[] => {
    if (!Validator.isNonEmptyArray(value)) {
        throw new NotFoundError(value);
    }
    return value as any[];
};

export const parseStringParameter = (value: any): string => {
    if (!Validator.isNonEmptyString(value)) {
        throw new BadRequestError();
    }
    return (value as string).trim();
};

export const parseArrayParameter = (values: any): string[] =>
    parseStringParameter(values).split(',').map((value: string) => parseStringParameter(value));
