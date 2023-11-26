import { createContext } from 'react';

export const LogsContext = createContext({
    logs: [],
    log: () => {},
    getLogger: () => (() => {}),
});

LogsContext.displayName = "LogsContext";
