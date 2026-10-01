const PRINT_ROOT_ID = 'print-root';
const PRINTING_CLASS = 'is-printing';

/**
 * Prints one part of the page. The element is cloned into a temporary root so the
 * print stylesheet (styles/print.css) can hide everything else, even when the element
 * lives inside a dialog. Returns false when there is nothing to print.
 */
export function printElement(element) {
  if (!element) return false;

  const root = document.createElement('div');
  root.id = PRINT_ROOT_ID;
  root.appendChild(element.cloneNode(true));
  document.body.appendChild(root);
  document.body.classList.add(PRINTING_CLASS);

  const cleanup = () => {
    document.body.classList.remove(PRINTING_CLASS);
    root.remove();
  };
  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
  return true;
}
