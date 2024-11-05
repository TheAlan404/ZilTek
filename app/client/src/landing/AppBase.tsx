import { HostContext } from "../host/HostContext";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DEFAULT_RELAY } from "../meta";
import { HostProvider } from "../host/HostProvider";
import { NetworkingProvider } from "../host/NetworkingProvider";

export const AppBase = () => {
    const { target } = useParams();
    const navigate = useNavigate();

    return (
        <HostContext.Provider
                value={{
                    exit: () => {
                        localStorage.setItem("ziltek:auto-local", 'false');
                        navigate("/");
                    },
                    ...(target == "local" ? {
                        clientType: "host",
                    } : {
                        clientType: "remote",
                        connectTo: target?.split("@")[0] || "",
                        remoteRelayURL: (target?.split("@").slice(1).join("@") || DEFAULT_RELAY).replace(/!/g, "/"),
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
