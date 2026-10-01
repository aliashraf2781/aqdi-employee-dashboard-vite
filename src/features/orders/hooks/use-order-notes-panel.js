/**
 * TODO: the "add a note" side panel (order comments) belongs to the app shell and is not ported yet.
 * Until it is, `isAvailable` is false and the details header hides the "إضافة ملاحظة" button.
 * When the panel exists, return `isAvailable: true` and make `openOrderNotes(orderId)` open it.
 */
export function useOrderNotesPanel() {
  return { isAvailable: false, openOrderNotes: () => {} };
}
