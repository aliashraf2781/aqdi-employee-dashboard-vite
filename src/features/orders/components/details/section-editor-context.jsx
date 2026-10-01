import { createContext, useContext } from 'react';

const SectionEditorContext = createContext(null);

/** Gives the form inside a section editor dialog a way to close it and a key that changes on every open. */
export function SectionEditorProvider({ onClose, resetKey = 0, children }) {
  return <SectionEditorContext.Provider value={{ onClose, resetKey }}>{children}</SectionEditorContext.Provider>;
}

export function useSectionEditor() {
  return useContext(SectionEditorContext);
}
