import { describe, expect, it } from 'vitest';
import { buildPaperworkFormData } from './paperwork';

const values = { name_ar: ' ورقة ', name_en: ' Paper ', contract_type: 'housing', icon: null, delete_icon: false };

describe('buildPaperworkFormData', () => {
  it('trims and appends the text fields', () => {
    const formData = buildPaperworkFormData(values);
    expect(formData.get('name_ar')).toBe('ورقة');
    expect(formData.get('name_en')).toBe('Paper');
    expect(formData.get('contract_type')).toBe('housing');
    expect(formData.has('icon')).toBe(false);
    expect(formData.has('delete_icon')).toBe(false);
  });

  it('appends the icon file and the delete flag only when set', () => {
    const icon = new File(['x'], 'icon.png', { type: 'image/png' });
    const formData = buildPaperworkFormData({ ...values, icon, delete_icon: true });
    expect(formData.get('icon')).toBeInstanceOf(File);
    expect(formData.get('delete_icon')).toBe('1');
  });
});
