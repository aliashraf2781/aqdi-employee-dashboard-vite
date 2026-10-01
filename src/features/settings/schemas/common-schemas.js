import { z } from 'zod';
import { REQUIRED_FIELDS_MESSAGE } from '@/features/settings/crud/crud-config';
import { CONTRACT_TYPES } from '@/features/settings/lib/labels';

/** Non-empty text after trimming. */
export const requiredText = (message = REQUIRED_FIELDS_MESSAGE) => z.string().trim().min(1, message);

export const contractTypeSchema = z.enum([CONTRACT_TYPES.housing, CONTRACT_TYPES.commercial], {
  errorMap: () => ({ message: REQUIRED_FIELDS_MESSAGE }),
});

/** Optional number typed into a text input: '' is allowed, otherwise it must be >= 0. */
export const optionalNonNegativeNumber = (message) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0), message);
