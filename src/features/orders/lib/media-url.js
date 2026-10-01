const DEFAULT_MEDIA_ORIGIN = 'https://aqid.subcodeco.com';

function pickString(...values) {
  const found = values.find((value) => typeof value === 'string' && value.trim());
  return found ? found.trim() : null;
}

/** Origin of the API host (e.g. https://aqid.subcodeco.com) where uploaded files live. */
export function getMediaOrigin() {
  const configured =
    import.meta.env.VITE_MEDIA_ORIGIN ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_PROXY_TARGET ||
    DEFAULT_MEDIA_ORIGIN;

  try {
    return new URL(configured).origin;
  } catch {
    return DEFAULT_MEDIA_ORIGIN;
  }
}

/** A usable URL string from the string/object file payloads the API returns. */
export function resolveMediaUrl(value) {
  if (!value) return null;
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'object') return pickString(value.url, value.path, value.full_url, value.src);
  return null;
}

/** Turns relative storage paths into absolute URLs the browser can load. */
export function absolutizeMediaUrl(value) {
  const raw = resolveMediaUrl(value);
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || raw.startsWith('blob:') || raw.startsWith('data:')) return raw;

  const origin = getMediaOrigin();
  if (raw.startsWith('//')) return `${origin.split(':')[0]}:${raw}`;
  if (raw.startsWith('/')) return `${origin}${raw}`;
  return `${origin}/${raw.replace(/^\.\//, '')}`;
}

export function fileNameFromMediaUrl(url, fallback = 'file') {
  if (!url) return fallback;
  try {
    const path = String(url).split('?')[0];
    return decodeURIComponent(path.split('/').pop() || '') || fallback;
  } catch {
    return fallback;
  }
}

export function isPdfMediaUrl(url) {
  return typeof url === 'string' && url.split('?')[0].toLowerCase().endsWith('.pdf');
}

function triggerBlobDownload(blob, name) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

/**
 * Downloads a file in the current tab. Returns false when the file host blocks
 * the request (CORS). The Next app had a same-origin proxy route for that case;
 * it is not part of this port.
 */
export async function downloadMedia(url, filename) {
  const href = absolutizeMediaUrl(url);
  if (!href) return false;
  const name = filename || fileNameFromMediaUrl(href, 'download');

  try {
    const response = await fetch(href, { credentials: 'omit' });
    if (!response.ok) return false;
    triggerBlobDownload(await response.blob(), name);
    return true;
  } catch {
    return false;
  }
}
