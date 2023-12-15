import { Badge, Button, Group, Tooltip } from "@mantine/core";
import { useContext } from "react";
import { ControllerAPI } from "../../../host/ControllerAPI";
import { useTranslation } from "react-i18next";

export const AppHeader = () => {
    const { audioState, currentlyPlayingAudio, processCommand } = useContext(ControllerAPI);
    const { t } = useTranslation();

    return (
        <Group>
            {currentlyPlayingAudio && (
                <Tooltip label={t("header.audioPlayingTooltip", { filename: currentlyPlayingAudio })}>
                    <Button
                        variant='light'
                        size="compact-md"
                        color="green"
                        onClick={() => processCommand({ type: "stopAllAudio" })}>
                        {t("header.audioPlaying", { filename: currentlyPlayingAudio })}
                    </Button>
                </Tooltip>
            )}
            {audioState == "suppressed" && (
                <Tooltip label={t("header.suppressedTooltip")}>
                    <Button
                        variant='light'
                        color="red"
                        onClick={() => {
                            processCommand({ type: "changeBellStatus", data: { on: true } });
                        }}>
                        {t("header.suppressed")}
                    </Button>
                </Tooltip>
            )}
            
        </Group>
    );
}

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
    )
}
