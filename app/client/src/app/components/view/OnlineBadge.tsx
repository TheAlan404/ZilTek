import { Badge, Tooltip } from "@mantine/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NetworkingContext } from "../../../host/NetworkingContext";
import { HostContext } from "../../../host/HostContext";

export const OnlineBadge = () => {
    const { clientType } = useContext(HostContext);
    const { rcEnabled, isConnected, error } = useContext(NetworkingContext);
    const { t } = useTranslation();

    return (
        <>
            {(rcEnabled || clientType == "remote") && (
                <Tooltip label={error?.toString?.() || ""} disabled={!error}>
                    <Badge color={isConnected ? "green" : "yellow"} variant={"light"}>
                        {t(isConnected ? (
                            clientType == "host" ? "header.online" : "header.connected"
                        ) : "header.offline")}
                    </Badge>
                </Tooltip>
            )}
        </>
    );
};
