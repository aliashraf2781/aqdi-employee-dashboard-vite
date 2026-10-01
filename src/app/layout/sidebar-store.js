import { create } from 'zustand';

export const DESKTOP_MEDIA_QUERY = '(min-width: 1201px)';

/** Whether the sidebar is expanded. The shell syncs it with the viewport size. */
export const useSidebarStore = create((set) => ({
  isOpen: true,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
