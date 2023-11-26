import { createContext } from 'react';

export const DBContext = createContext([{}, () => {}]);

DBContext.displayName = "DBContext";
