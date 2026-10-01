import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins class names and resolves conflicting Tailwind classes. */
export const cn = (...inputs) => twMerge(clsx(inputs));
