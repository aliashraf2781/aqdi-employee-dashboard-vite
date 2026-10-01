import { describe, expect, it } from 'vitest';
import { buildSectionDefaults, buildSectionPayload, buildSectionSchema } from './section-form';

const config = {
  key: 'features',
  fields: [{ name: 'badge_text', required: 'مطلوب', default: 'افتراضي' }],
  image: true,
  cards: {
    fields: [{ name: 'title', required: 'العنوان مطلوب' }],
    image: true,
    defaultToggle: true,
    features: true,
    defaults: [{ title: 'بطاقة', features: [{ text: 'ميزة' }] }],
  },
};

describe('buildSectionDefaults', () => {
  it('uses saved values, then config defaults', () => {
    expect(buildSectionDefaults(config, { badge_text: 'محفوظ' }).badge_text).toBe('محفوظ');
    expect(buildSectionDefaults(config, null).badge_text).toBe('افتراضي');
  });

  it('builds cards from the config defaults when none are saved', () => {
    const values = buildSectionDefaults(config, {});
    expect(values.cards).toHaveLength(1);
    expect(values.cards[0].title).toBe('بطاقة');
    expect(values.cards[0].features).toEqual([{ id: null, text: 'ميزة' }]);
    expect(values.cards[0].image).toEqual({ url: '', file: null, removed: false });
  });

  it('keeps saved image urls', () => {
    const values = buildSectionDefaults(config, { image_url: 'https://x/y.png', cards: [{ id: 3, title: 'a', image_url: 'u' }] });
    expect(values.image.url).toBe('https://x/y.png');
    expect(values.cards[0]).toMatchObject({ id: 3, title: 'a' });
    expect(values.cards[0].image.url).toBe('u');
  });
});

describe('buildSectionPayload', () => {
  it('prefixes keys with the section key and sends keep flags for unchanged images', () => {
    const values = buildSectionDefaults(config, { cards: [{ id: 7, title: 'a', is_default: true }] });
    const body = buildSectionPayload(config, values);
    expect(body.get('features[badge_text]')).toBe('افتراضي');
    expect(body.get('features[keep_image]')).toBe('1');
    expect(body.get('features[cards][0][id]')).toBe('7');
    expect(body.get('features[cards][0][is_default]')).toBe('1');
    expect(body.get('features[cards][0][keep_image]')).toBe('1');
  });

  it('sends the picked file and a removal flag', () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const values = buildSectionDefaults(config, {});
    values.image.file = file;
    values.cards[0].image.removed = true;
    const body = buildSectionPayload(config, values);
    expect(body.get('features[image]')).toBeInstanceOf(File);
    expect(body.get('features[cards][0][keep_image]')).toBe('0');
  });

  it('creates ids for new cards unless omitted', () => {
    const values = buildSectionDefaults(config, {});
    expect(buildSectionPayload(config, values).get('features[cards][0][id]')).toMatch(/^new-/);
    const noIds = { ...config, cards: { ...config.cards, omitNewId: true } };
    expect(buildSectionPayload(noIds, values).has('features[cards][0][id]')).toBe(false);
  });
});

describe('buildSectionSchema', () => {
  it('requires configured fields, also inside cards', () => {
    const schema = buildSectionSchema(config);
    const values = buildSectionDefaults(config, {});
    expect(schema.safeParse(values).success).toBe(true);

    const result = schema.safeParse({ ...values, badge_text: ' ', cards: [{ ...values.cards[0], title: '' }] });
    const messages = result.error.issues.map((issue) => issue.message);
    expect(messages).toContain('مطلوب');
    expect(messages).toContain('العنوان مطلوب');
  });

  it('validates phone fields', () => {
    const phone = buildSectionSchema({ key: 'contact', fields: [{ name: 'contact_number', kind: 'phone' }] });
    expect(phone.safeParse({ contact_number: '0512345678' }).success).toBe(true);
    expect(phone.safeParse({ contact_number: '123' }).success).toBe(false);
  });
});
