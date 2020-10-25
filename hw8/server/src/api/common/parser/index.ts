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
        value = +(value.toFixed(3));
    }
    return value;
};

export const parseArray = (value: any): any[] => {
    if (!Validator.isNonEmptyArray(value)) {
        throw new NotFoundError(value);
    }
    return value as any[];
};

export const parseParameter = (value: any): string => {
    if (!Validator.isNonEmptyString(value)) {
        throw new BadRequestError();
    }
    return (value as string).trim();
};
