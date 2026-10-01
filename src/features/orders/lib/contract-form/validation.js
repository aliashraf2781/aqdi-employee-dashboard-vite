import { z } from 'zod';
import { validateOtherConditionsList, validateTenantRoleSelection } from '../contract-update';
import { getSaudiContactFieldError, getSaudiContactFieldKind } from '../saudi-contact';
import { isFieldEmpty, isFieldVisible } from './field-visibility';

export const REQUIRED_MESSAGE = 'هذا الحقل مطلوب';
export const POSITIVE_AREA_MESSAGE = 'يجب أن تكون المساحة أكبر من صفر';

/**
 * Errors are keyed by field key. Errors of one item inside a list use "key:index" (not "key.index"),
 * so react-hook-form keeps them flat instead of nesting them.
 */
export function toErrorKey(apiKey) {
  return String(apiKey).replace(/\.(\d+)$/, ':$1');
}

function visibleFields(fields, form) {
  return fields.filter((field) => isFieldVisible(field, form));
}

function requiredErrors(fields, form) {
  const errors = {};
  visibleFields(fields, form).forEach((field) => {
    if (field.required && isFieldEmpty(form[field.key])) errors[field.key] = REQUIRED_MESSAGE;
  });
  return errors;
}

function formatErrors(fields, form) {
  const errors = {};
  visibleFields(fields, form).forEach((field) => {
    const value = form[field.key];
    if (isFieldEmpty(value)) return;

    if (field.key === 'unit_area') {
      const area = Number(String(value).replace(/,/g, '').trim());
      if (!Number.isFinite(area) || area <= 0) errors[field.key] = POSITIVE_AREA_MESSAGE;
    }
    if (getSaudiContactFieldKind(field)) {
      const message = getSaudiContactFieldError(field, value);
      if (message) errors[field.key] = message;
    }
  });
  return errors;
}

function mapListErrors(errors) {
  return Object.fromEntries(Object.entries(errors).map(([key, message]) => [toErrorKey(key), message]));
}

/** Validation of the whole contract form: required fields first, then formats, tenant roles and conditions. */
export function validateContractForm({ fields, form, tenantRoles = [] }) {
  const required = requiredErrors(fields, form);
  if (Object.keys(required).length > 0) return required;

  const formats = formatErrors(fields, form);
  if (Object.keys(formats).length > 0) return formats;

  const keys = new Set(fields.map((field) => field.key));
  if (keys.has('tenant_role_ids')) {
    const roleErrors = validateTenantRoleSelection(form.tenant_role_ids, form.tenant_role_values, tenantRoles);
    if (Object.keys(roleErrors).length > 0) return mapListErrors(roleErrors);
  }
  if (keys.has('other_conditions_list')) {
    const conditionErrors = validateOtherConditionsList(form.conditions, form.other_conditions_list);
    if (Object.keys(conditionErrors).length > 0) return mapListErrors(conditionErrors);
  }
  return {};
}

/** Zod schema running validateContractForm, so the form can use the normal zod resolver. */
export function buildContractFormSchema(fields, tenantRoles = []) {
  return z.record(z.any()).superRefine((form, context) => {
    const errors = validateContractForm({ fields, form, tenantRoles });
    Object.entries(errors).forEach(([key, message]) => {
      context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
    });
  });
}

/** The toast shown when saving is blocked: a generic one for missing required fields, else the first message. */
export function describeValidationFailure(errors) {
  const messages = Object.values(errors);
  if (messages.some((message) => message === REQUIRED_MESSAGE)) return 'يرجى تعبئة الحقول المطلوبة';
  return messages[0] ?? REQUIRED_MESSAGE;
}

/**
 * Server validation errors ({ 'a.b.3': 'msg' }) mapped to the form: only keys of this form's fields
 * are kept, and a "required" answer for a non-positive area becomes the area message.
 */
export function mapServerErrorsToFields(serverErrors, fields, form) {
  const fieldKeys = new Set(fields.map((field) => field.key));
  const areaRaw = String(form.unit_area ?? '').replace(/,/g, '').trim();
  const areaIsNotPositive = areaRaw !== '' && Number(areaRaw) <= 0;
  const resolved = {};

  Object.entries(serverErrors).forEach(([apiKey, message]) => {
    const leaf = apiKey.split('.').pop();
    const key = fieldKeys.has(apiKey) ? apiKey : fieldKeys.has(leaf) ? leaf : null;
    if (!key) return;
    resolved[key] = key === 'unit_area' && areaIsNotPositive && message === REQUIRED_MESSAGE ? POSITIVE_AREA_MESSAGE : message;
  });
  return resolved;
}
