const JSON_CONTENT_TYPE = 'application/json';

function filenameFromDisposition(header) {
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(header || '');
  const raw = match?.[1] || match?.[2];
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function saveBlob(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

/**
 * The export endpoint either streams a CSV or answers with JSON `{ data: { url } }`
 * pointing at a hosted file. Handles both.
 */
export async function saveExportResponse(response, fallbackName) {
  const blob = response.data;

  if ((blob?.type || '').includes(JSON_CONTENT_TYPE)) {
    const url = JSON.parse(await blob.text())?.data?.url;
    if (!url) throw new Error('no file url');
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  const filename = filenameFromDisposition(response.headers?.['content-disposition']) || fallbackName;
  saveBlob(blob, filename);
}
