import { createContext } from "react";

export const ChangesContext = createContext({
    unsavedChanges: [],
    savedChanges: [],
    markAsDirty: () => {},
    markAsSaved: () => {},
    markAsReverted: () => {},
});
