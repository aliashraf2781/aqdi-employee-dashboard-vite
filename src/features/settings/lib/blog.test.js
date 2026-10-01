import { describe, expect, it } from 'vitest';
import { PUBLISH_MODES, blogToFormValues, buildBlogFormData, formatApiDateTime, isBlogContentEmpty } from './blog';

const baseValues = {
  title: 'عنوان',
  description: '<p>نص</p>',
  meta_title: '',
  meta_description: '',
  is_active: true,
  publishMode: PUBLISH_MODES.draft,
  publish_at: '',
  image: null,
};

describe('blog helpers', () => {
  it('formats API date times', () => {
    expect(formatApiDateTime(new Date(2026, 0, 5, 3, 4, 9))).toBe('2026-01-05 03:04:09');
  });

  it('detects empty editor content', () => {
    expect(isBlogContentEmpty('<p></p>')).toBe(true);
    expect(isBlogContentEmpty('<p>نص</p>')).toBe(false);
  });

  it('maps a draft blog to the draft mode', () => {
    expect(blogToFormValues({ title: 'أ', status: 'draft' }).publishMode).toBe(PUBLISH_MODES.draft);
  });

  it('maps a published blog without a date to "now" and with a date to "schedule"', () => {
    expect(blogToFormValues({ status: 'published' }).publishMode).toBe(PUBLISH_MODES.now);
    const scheduled = blogToFormValues({ status: 'published', timePublish: '2026-03-01T14:05:00' });
    expect(scheduled.publishMode).toBe(PUBLISH_MODES.schedule);
    expect(scheduled.publish_at).toBe('2026-03-01T14:05');
  });
});

describe('buildBlogFormData', () => {
  it('sends drafts without a publish date', () => {
    const formData = buildBlogFormData(baseValues);
    expect(formData.get('status')).toBe('draft');
    expect(formData.has('publish_at')).toBe(false);
    expect(formData.get('is_active')).toBe('1');
  });

  it('publishes immediately with the current time', () => {
    const now = new Date(2026, 5, 1, 10, 0, 0);
    const formData = buildBlogFormData({ ...baseValues, publishMode: PUBLISH_MODES.now }, now);
    expect(formData.get('status')).toBe('published');
    expect(formData.get('publish_at')).toBe('2026-06-01 10:00:00');
  });

  it('publishes at the chosen time when scheduled', () => {
    const formData = buildBlogFormData({ ...baseValues, publishMode: PUBLISH_MODES.schedule, publish_at: '2026-07-01T09:30' });
    expect(formData.get('publish_at')).toBe('2026-07-01 09:30:00');
  });

  it('attaches the image file only when one was picked', () => {
    const image = new File(['x'], 'cover.png', { type: 'image/png' });
    expect(buildBlogFormData({ ...baseValues, image }).get('image')).toBeInstanceOf(File);
    expect(buildBlogFormData(baseValues).has('image')).toBe(false);
  });
});
