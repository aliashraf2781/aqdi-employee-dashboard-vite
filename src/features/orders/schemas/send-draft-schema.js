import { z } from 'zod';
import { getSaudiMobileError } from '../lib/saudi-contact';

export const CONTACT_MODES = { SAME: 'same', ANOTHER: 'another' };

export const sendDraftSchema = z
  .object({
    draft_number: z.string().trim().min(1, 'رقم مسودة العقد مطلوب'),
    contact_mode: z.enum([CONTACT_MODES.SAME, CONTACT_MODES.ANOTHER]),
    other_number: z.string().trim(),
  })
  .superRefine((values, context) => {
    if (values.contact_mode !== CONTACT_MODES.ANOTHER) return;
    const message = getSaudiMobileError(values.other_number, { required: true });
    if (message) context.addIssue({ code: z.ZodIssueCode.custom, path: ['other_number'], message });
  });

export const sendDraftDefaults = { draft_number: '', contact_mode: CONTACT_MODES.SAME, other_number: '' };

/** Body of the "send contract draft" status change. */
export function buildSendDraftBody(statusId, values) {
  const body = {
    status_id: Number(statusId),
    ejar_contract_draft_number: values.draft_number.trim(),
    contact_number_mode: values.contact_mode,
  };
  if (values.contact_mode === CONTACT_MODES.ANOTHER) body.contact_number = values.other_number.trim();
  return body;
}
