import { z } from 'zod';
import { assetFormValue, buildSectionFormData, getStringValue, newLocalId } from '@/features/marketing/lib/content-pages';
import { getSaudiMobileError } from '@/features/marketing/lib/saudi-mobile';

/*
 * A content section is described by a plain "section config" (see schemas/*-sections.js):
 *   { key, fields, image?, groups?, cards? }
 * These helpers turn that config into form default values, a zod schema and the multipart body,
 * so one generic <SectionForm> can edit every section. Form field names are the API keys.
 */

const FEATURE_TEXT_REQUIRED = 'نص الميزة مطلوب';

/** Value shape used by image fields: the saved url, a newly picked file and a "removed" flag. */
export function buildImageValue(url) {
  return { url: getStringValue(url), file: null, removed: false };
}

function buildFieldValues(fields, source) {
  return Object.fromEntries(
    fields.map((field) => [field.name, getStringValue(source?.[field.name], field.default ?? '')]),
  );
}

function buildFeatureValues(features) {
  if (!features?.length) return [{ id: null, text: '' }];
  return features.map((feature) => ({ id: feature.id ?? null, text: getStringValue(feature.text) }));
}

function buildCardValues(cardConfig, card = {}) {
  const values = { id: card.id ?? null, ...buildFieldValues(cardConfig.fields, card) };
  if (cardConfig.image) values.image = buildImageValue(card.image_url);
  if (cardConfig.license) values.license = buildImageValue(card.license_file_url);
  if (cardConfig.defaultToggle) values.is_default = Boolean(card.is_default);
  if (cardConfig.features) values.features = buildFeatureValues(card.features);
  return values;
}

/** An empty card for the "add" button. */
export function buildEmptyCard(cardConfig) {
  return { ...buildCardValues(cardConfig), id: newLocalId() };
}

/** Form values from the saved section (`data`), falling back to the config defaults. */
export function buildSectionDefaults(config, data) {
  const values = buildFieldValues(config.fields ?? [], data);
  if (config.image) values.image = buildImageValue(data?.image_url);

  (config.groups ?? []).forEach((group) => {
    values[group.name] = buildFieldValues(group.fields, data?.[group.name]);
    if (group.image) values[group.name].image = buildImageValue(data?.[group.name]?.image_url);
  });

  if (config.cards) {
    const source = data?.cards?.length ? data.cards : config.cards.defaults;
    values.cards = source.map((card) => buildCardValues(config.cards, card));
  }
  return values;
}

function buildFieldsPayload(fields, values) {
  return Object.fromEntries(fields.map((field) => [field.name, values[field.name]]));
}

function buildCardPayload(cardConfig, card) {
  const payload = buildFieldsPayload(cardConfig.fields, card);
  if (card.id) payload.id = card.id;
  else if (!cardConfig.omitNewId) payload.id = newLocalId();

  if (cardConfig.image) Object.assign(payload, assetFormValue(card.image?.file, card.image?.removed));
  if (cardConfig.license) {
    Object.assign(payload, assetFormValue(card.license?.file, card.license?.removed, 'license_file', 'license'));
  }
  if (cardConfig.defaultToggle) payload.is_default = card.is_default ? '1' : '0';
  if (cardConfig.features) {
    payload.features = card.features.map((feature) => ({ id: feature.id || newLocalId(), text: feature.text }));
  }
  return payload;
}

/** Multipart body (`<key>[field]`, `<key>[cards][0][field]` ...) for the save endpoint. */
export function buildSectionPayload(config, values) {
  const payload = buildFieldsPayload(config.fields ?? [], values);
  if (config.image) Object.assign(payload, assetFormValue(values.image?.file, values.image?.removed));

  (config.groups ?? []).forEach((group) => {
    const groupValues = values[group.name];
    payload[group.name] = buildFieldsPayload(group.fields, groupValues);
    if (group.image) Object.assign(payload[group.name], assetFormValue(groupValues.image?.file, groupValues.image?.removed));
  });

  if (config.cards) payload.cards = values.cards.map((card) => buildCardPayload(config.cards, card));
  return buildSectionFormData(config.key, payload);
}

function buildFieldSchema(field) {
  if (field.kind === 'phone') {
    return z.string().superRefine((value, context) => {
      const message = getSaudiMobileError(value);
      if (message) context.addIssue({ code: z.ZodIssueCode.custom, message });
    });
  }
  return field.required ? z.string().trim().min(1, field.required) : z.string();
}

// `passthrough` keeps the keys that need no validation (ids, image values, flags).
function buildObjectSchema(fields, extraShape = {}) {
  const shape = Object.fromEntries(fields.map((field) => [field.name, buildFieldSchema(field)]));
  return z.object({ ...shape, ...extraShape }).passthrough();
}

function buildCardSchema(cardConfig) {
  const featuresShape = cardConfig.features
    ? { features: z.array(z.object({ text: z.string().trim().min(1, FEATURE_TEXT_REQUIRED) }).passthrough()) }
    : {};
  return buildObjectSchema(cardConfig.fields, featuresShape);
}

export function buildSectionSchema(config) {
  const groupsShape = Object.fromEntries((config.groups ?? []).map((group) => [group.name, buildObjectSchema(group.fields)]));
  const cardsShape = config.cards ? { cards: z.array(buildCardSchema(config.cards)) } : {};
  return buildObjectSchema(config.fields ?? [], { ...groupsShape, ...cardsShape });
}
