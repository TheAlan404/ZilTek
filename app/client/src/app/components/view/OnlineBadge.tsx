import { Badge } from "@mantine/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NetworkingContext } from "../../../host/NetworkingContext";
import { HostContext } from "../../../host/HostContext";

export const OnlineBadge = () => {
    const { clientType } = useContext(HostContext);
    const { rcEnabled, isConnected } = useContext(NetworkingContext);
    const { t } = useTranslation();

    if(clientType == "remote") return;

    return (
        <>
            {(rcEnabled) && (
                <Badge color={isConnected ? "green" : "yellow"} variant={"light"}>
                    {t(isConnected ? "header.online" : "header.offline")}
                </Badge>
            )}
        </>
    );
};
