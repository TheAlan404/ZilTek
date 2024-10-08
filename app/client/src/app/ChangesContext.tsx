import { createContext } from "react";

export interface Changes {
    unsavedChanges: string[],
    savedChanges: string[],
    markAsDirty: (v: string) => void,
    markAsSaved: (v: string) => void,
    markAsReverted: (v: string) => void,
    ignoreAll: () => void,
}

export const ChangesContext = createContext<Changes>({
    unsavedChanges: [],
    savedChanges: [],
    markAsDirty: () => {},
    markAsSaved: () => {},
    markAsReverted: () => {},
    ignoreAll() {},
});
