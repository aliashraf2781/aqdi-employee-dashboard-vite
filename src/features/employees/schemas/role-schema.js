import { z } from 'zod';

const MISSING_FIELDS_MESSAGE = 'يرجى ملء جميع الحقول المطلوبة';
const MISSING_PERMISSIONS_MESSAGE = 'يرجى تحديد صلاحية واحدة على الأقل';

const roleFields = {
  title_ar: z.string().trim().min(1, MISSING_FIELDS_MESSAGE),
  description: z.string().optional(),
  activate_all: z.boolean(),
  permissions: z.array(z.string()),
};

function requirePermissions(values, context) {
  if (values.activate_all || values.permissions.length > 0) return;
  context.addIssue({ code: z.ZodIssueCode.custom, path: ['permissions'], message: MISSING_PERMISSIONS_MESSAGE });
}

/** The system key can only be chosen when creating; it is read-only afterwards. */
export const createRoleSchema = z
  .object({ ...roleFields, name: z.string().trim().min(1, MISSING_FIELDS_MESSAGE) })
  .superRefine(requirePermissions);

export const editRoleSchema = z
  .object({ ...roleFields, is_active: z.boolean(), employee_id: z.string() })
  .superRefine(requirePermissions);
