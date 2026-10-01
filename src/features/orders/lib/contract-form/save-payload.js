import { buildContractUpdatePayload } from '../contract-update';

const pickKeys = (values, keys) => Object.fromEntries(Object.entries(values).filter(([key]) => keys.has(key)));

/** Payload of a custom save (units): every edited field whose value changed. */
function buildChangedFieldsPayload(editableKeys, form, initial) {
  const payload = {};
  editableKeys.forEach((key) => {
    const value = form[key];
    const previous = initial[key];
    if (value === previous) return;
    if (value === '' && (previous === '' || previous === undefined)) return;
    payload[key] = value;
  });
  return payload;
}

/**
 * What to send when the editor saves.
 * - default: for every contract step the fields belong to, the changed keys of that step;
 * - `customSave: true` (units): the changed keys, whatever step they belong to.
 * `payloadExtras` are always added (e.g. the unit id), but do not count as a change.
 * Returns { payload, hasChanges }.
 */
export function buildEditorSavePayload({ fields, step, form, initial, payloadExtras = null, customSave = false }) {
  const editableKeys = new Set(fields.map((field) => field.key));
  const scopedForm = pickKeys(form, editableKeys);
  const scopedInitial = pickKeys(initial, editableKeys);

  let payload = {};
  if (customSave) {
    payload = buildChangedFieldsPayload(editableKeys, scopedForm, scopedInitial);
  } else {
    const steps = new Set([step, ...fields.map((field) => field.step).filter(Boolean)]);
    steps.forEach((stepName) => {
      payload = { ...payload, ...buildContractUpdatePayload(stepName, scopedForm, scopedInitial) };
    });
  }

  const extras = payloadExtras ?? {};
  payload = { ...payload, ...extras };

  const hasChanges = Object.keys(payload).some((key) => !(key in extras));
  return { payload, hasChanges };
}
