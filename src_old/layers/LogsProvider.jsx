import React, { useContext, useState } from 'react'
import { HostContext } from '../contexts/HostContext'
import { useListState } from '@mantine/hooks';
import { LogsContext } from '../contexts/LogsContext';

const LogsProvider = ({ children }) => {
    let [logs, handlers] = useListState([
        { msg: "Logger started", date: Date.now(), type: "sys" },
    ]);

    return (
        <LogsContext.Provider value={{
            logs,
            log: (msg, type = "sys") => handlers.append({
                msg,
                date: Date.now(),
                type,
            }),
            getLogger: (id, type = "sys") => {
                return (msg) => handlers.append({
                    msg: "[" + id + "] " + msg,
                    date: Date.now(),
                    type,
                });
            },
        }}>
            {children}
        </LogsContext.Provider>
    )
}

export default LogsProvider

export const useLogger = (id, type) => {
    return useContext(LogsContext).getLogger(id, type);
};
