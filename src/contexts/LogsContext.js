import { createContext } from 'react';

export const LogsContext = createContext([[], () => {}]);

LogsContext.displayName = "LogsContext";
