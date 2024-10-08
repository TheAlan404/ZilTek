import { Badge } from "@mantine/core";
import { useContext } from "react";
import { ControllerAPI } from "../../../host/ControllerAPI";
import { useTranslation } from "react-i18next";


export const OnlineBadge = () => {
    const { isConnected, remoteControlEnabled, hostMode } = useContext(ControllerAPI);
    const { t } = useTranslation();

    return (
        <>
            {(remoteControlEnabled || hostMode == "remote") && (
                <Badge color={isConnected ? "green" : (hostMode == "local" ? "gray" : "red")} variant={"light"}>
                    {t(hostMode == "local" ? (
                        isConnected ? "header.online" : "header.offline"
                    ) : (
                        isConnected ? "header.connected" : "header.hostOffline"
                    ))}
                </Badge>
            )}
        </>
    );
};
