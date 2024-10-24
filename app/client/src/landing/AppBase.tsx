import { HostContext } from "../host/HostContext";
import { NetworkingProvider } from "../host/NetworkingContext";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DEFAULT_RELAY } from "../meta";
import { HostProvider } from "../host/HostProvider";

export const AppBase = () => {
    const { target } = useParams();
    const navigate = useNavigate();

    return (
        <HostContext.Provider
                value={{
                    exit: () => navigate("/"),
                    ...(target == "local" ? {
                        clientType: "host",
                    } : {
                        clientType: "remote",
                        connectTo: target?.split("@")[0] || "",
                        remoteRelayURL: target?.split("@").slice(1).join("@") || DEFAULT_RELAY,
                    }),
                }}
            >
                <NetworkingProvider>
                    <HostProvider>
                        <Outlet />
                    </HostProvider>
                </NetworkingProvider>
            </HostContext.Provider>
    );
};
