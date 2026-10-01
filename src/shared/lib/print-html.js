const PRINT_DELAY_MS = 300;
const CLEANUP_DELAY_MS = 1000;

/** Renders `html` into a hidden iframe and opens the browser print dialog for it. */
export function printHtmlDocument(html) {
  if (!html) return false;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = frameWindow?.document;
  if (!frameDocument) {
    iframe.remove();
    return false;
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  const print = () => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } finally {
      setTimeout(() => iframe.remove(), CLEANUP_DELAY_MS);
    }
  };

  if (frameDocument.readyState === 'complete') setTimeout(print, PRINT_DELAY_MS);
  else iframe.onload = () => setTimeout(print, PRINT_DELAY_MS);

  return true;
}
