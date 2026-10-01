const MENU_CLOSE_DELAY_MS = 10;

/**
 * Opens a dialog that was triggered from a dropdown menu item.
 * Doing it in the same tick as the menu closing loses focus restoration, so we wait a moment.
 */
export function openDialogAfterMenuClose(openDialog, delayMs = MENU_CLOSE_DELAY_MS) {
  window.setTimeout(openDialog, delayMs);
}
