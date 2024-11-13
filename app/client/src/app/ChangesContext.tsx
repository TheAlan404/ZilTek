import { createContext } from "react";

export interface Changes {
    dirty: Set<string>;
}

export const ChangesContext = createContext<Changes>({
    dirty: new Set(),
});
