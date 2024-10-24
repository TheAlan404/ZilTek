import { useTranslation } from "react-i18next";
import useMobile from "../../../hooks/useMobile"
import { BUILD, VERSION } from "../../../meta";
import { ActionIcon, Fieldset, Flex, Group, Highlight, Stack, Tooltip } from "@mantine/core";
import { IconExternalLink, IconTriangle } from "@tabler/icons-react";
import { useContext } from "react";
import { Controller } from "../../../host/ControllerAPI";
import { RemoteControlSettings } from "./main/RemoteControlSettings";
import { MaintenanceSection } from "./main/MaintenanceSection";
import { UpdateChecker } from "./main/UpdateChecker";
import { HostContext } from "../../../host/HostContext";

const AUTHOR = "dennis";
const highlightStyles = {
    backgroundImage:
        'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
    fontWeight: 700,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

export const EditorMainTab = () => {
    const { clientType } = useContext(HostContext);
    const { t } = useTranslation();
    const isMobile = useMobile();

    return (
        <Flex justify="center" pb="xl" mb="xl">
            <Stack w={isMobile ? "100%" : "50%"}>
                <Fieldset
                    legend={t("editor.sections.ziltek.title")}>
                    <Stack ta="center">
                        <Highlight
                            highlight={[VERSION, BUILD]}
                            highlightStyles={highlightStyles}
                        >{t("editor.sections.ziltek.desc", {
                            version: VERSION,
                            build: BUILD,
                        })}</Highlight>

                        <Group justify="center">
                            <Highlight
                                highlight={["ZilTek", AUTHOR]}
                                color="violet"
                                highlightStyles={{
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                {t("editor.sections.ziltek.made_by", { author: AUTHOR })}
                            </Highlight>
                            <Tooltip label={t("editor.sections.ziltek.website")}>
                                <ActionIcon
                                    component="a"
                                    variant="subtle"
                                    href="https://deniz.blue/"
                                    target="_blank"
                                    color="dark">
                                    <IconExternalLink />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        {/* hostMode == "local" && <UpdateChecker /> */}
                    </Stack>
                </Fieldset>
                {clientType == "host" && <RemoteControlSettings />}
                {clientType == "host" && <MaintenanceSection />}
            </Stack>
        </Flex>
    )
}


