import { PropsWithChildren, useContext } from "react";
import { HostContext } from "./ctx/HostContext";
import { IndexedDBFilesystem } from "./fs/IndexedDBFilesystem";
import { LocalHost } from "./Local";
import { RemoteHost } from "./Remote";

export const HostProvider = ({ children }: PropsWithChildren) => {
    const { clientType } = useContext(HostContext);

    if (clientType == "host") {
        const FilesystemProvider = (
            IndexedDBFilesystem
        );

        return (
            <FilesystemProvider>
                <LocalHost>
                    {children}
                </LocalHost>
            </FilesystemProvider>
        )
    } else {
        return (
            <RemoteHost>
                {children}
            </RemoteHost>
        )
    }
};
