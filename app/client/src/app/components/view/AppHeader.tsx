import { Button, Group, Tooltip } from "@mantine/core";
import { useContext } from "react";
import { Controller } from "../../../host/ControllerAPI";
import { useTranslation } from "react-i18next";
import { Command } from "@ziltek/common/src/cmd/Command";

export const AppHeader = () => {
    const { audioState, processCommand } = useContext(Controller);
    const { t } = useTranslation();

    return (
        <Group>
            {audioState.currentlyPlaying && (
                <Tooltip label={t("header.audioPlayingTooltip", { filename: audioState.currentlyPlaying })}>
                    <Button
                        variant='light'
                        size="compact-md"
                        color="green"
                        onClick={() => processCommand(Command.ForceStop())}>
                        {t("header.audioPlaying", { filename: audioState.currentlyPlaying })}
                    </Button>
                </Tooltip>
            )}
        </Group>
    );
}

