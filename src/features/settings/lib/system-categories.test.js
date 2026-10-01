import { describe, expect, it } from 'vitest';
import { SYSTEM_CATEGORIES, categorySubtitle } from './system-categories';

describe('SYSTEM_CATEGORIES', () => {
  it('links every category to its settings page', () => {
    expect(SYSTEM_CATEGORIES.find((category) => category.id === 'cities').href).toBe('/home/settings/cities');
  });

  it('has unique ids', () => {
    const ids = SYSTEM_CATEGORIES.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('categorySubtitle', () => {
  const counted = { countLabel: 'قائمة' };

  it('shows the fixed subtitle for cards without a count label', () => {
    expect(categorySubtitle({ subtitle: 'محتوى نصّي' }, 5)).toBe('محتوى نصّي');
    expect(categorySubtitle({}, undefined)).toBe('');
  });

  it('shows the count, a placeholder while loading, or just the label on failure', () => {
    expect(categorySubtitle(counted, 12)).toBe('قائمة · 12 عنصر');
    expect(categorySubtitle(counted, null)).toBe('قائمة · …');
    expect(categorySubtitle(counted, undefined)).toBe('قائمة');
  });
});
