import { useTranslation } from "react-i18next";
import useMobile from "../../../hooks/useMobile"
import { BUILD, VERSION } from "../../../meta";
import { ActionIcon, Button, Checkbox, Code, Fieldset, Flex, Group, Highlight, Loader, Stack, Text, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconDownload, IconExternalLink, IconInfoCircle, IconReload, IconTrash, IconTriangle } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { ControllerAPI } from "../../../host/ControllerAPI";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

const AUTHOR = "dennis";
const highlightStyles = {
    backgroundImage:
        'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
    fontWeight: 700,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};
const UPDATE_URL = "https://raw.githack.com/TheAlan404/ZilTekProject/main/metadata.json";

type UpdateInfo = {
    status: "error",
    error: Error,
} | {
    status: "checking"
} | {
    status: "upToDate"
} | {
    status: "outdated",
    lastVersion: string,
    url: string,
};

export const EditorMainTab = () => {
    const { hostMode } = useContext(ControllerAPI);
    const { t } = useTranslation();
    const isMobile = useMobile();
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({ status: "checking" });

    useEffect(() => {
        if (updateInfo.status == "checking") {
            (async () => {
                let res = await fetch(UPDATE_URL);
                let json = await res.json();
                console.log(json)
                if (json.latestVersion == VERSION) {
                    setUpdateInfo({
                        status: "upToDate"
                    })
                } else {
                    setUpdateInfo({
                        lastVersion: json.latestVersion,
                        url: json.url,
                        status: "outdated",
                    })
                }
            })().catch(e => {
                console.log(e);
                setUpdateInfo({ status: "error", error: e });
            });
        }
    }, [updateInfo]);

    let updateIcon = <IconInfoCircle />;
    if (updateInfo.status == "checking") updateIcon = <Loader size="sm" />;
    if (updateInfo.status == "upToDate") updateIcon = <IconCheck color="green" />;
    if (updateInfo.status == "error") updateIcon = <IconAlertTriangle />;

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
                                    href="https://thealan404.github.io/"
                                    target="_blank"
                                    color="dark">
                                    <IconExternalLink />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        <Group justify="center">
                            {updateIcon}
                            {({
                                checking: () => t("editor.sections.ziltek.checkingForUpdates"),
                                upToDate: () => t("editor.sections.ziltek.upToDate"),
                                error: () => t("editor.sections.ziltek.updateError"),
                                outdated: () => (
                                    <Group>
                                        <Text>{t("editor.sections.ziltek.updateAvailable", {
                                            available: updateInfo.lastVersion,
                                            current: VERSION,
                                        })}</Text>
                                        <Button
                                            component="a"
                                            variant="light"
                                            href={updateInfo.url}
                                            target="_blank"
                                            color="green"
                                            leftSection={<IconDownload />}
                                        >
                                            {t("editor.sections.ziltek.updateButton")}
                                        </Button>
                                    </Group>
                                ),
                            })[updateInfo.status]()}
                            <Tooltip label={t("editor.sections.ziltek.recheckUpdates")}>
                                <ActionIcon
                                    variant="subtle"
                                    color="dark"
                                    disabled={updateInfo.status == "checking"}
                                    onClick={() => setUpdateInfo({ status: "checking" })}
                                >
                                    <IconReload />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Stack>
                </Fieldset>
                {hostMode == "local" && <RemoteControlSettings />}
                {hostMode == "local" && <MaintenanceSection />}
            </Stack>
        </Flex>
    )
}

const RemoteControlSettings = () => {
    const { t } = useTranslation();
    const {
        remoteControlEnabled,
        setRemoteControlEnabled,
        hostId,
    } = useContext(ControllerAPI);

    return (
        <Fieldset
            legend={t("editor.sections.rc.title")}>
            <Stack>
                <Checkbox
                    checked={remoteControlEnabled}
                    onChange={(v) => setRemoteControlEnabled(v.target.checked)}
                    label={t("rc.enabled")}
                    description={t("rc.enabledDesc")}
                />
                {remoteControlEnabled && (
                    <Group justify="space-between">
                        <Text>
                            {t("rc.hostId")}
                        </Text>
                        <Group>
                            <Code>
                                {hostId}
                            </Code>
                        </Group>
                    </Group>
                )}
            </Stack>
        </Fieldset>
    )
}

const MaintenanceSection = () => {
    const { t } = useTranslation();
    const {
        processCommand
    } = useContext(ControllerAPI);

    return (
        <Fieldset
            legend={t("editor.sections.maintenance.title")}>
            <Stack>
                <Group justify="center">
                    <Button
                        color="red"
                        variant="light"
                        leftSection={<IconTrash />}
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("modals.clearAllData.title"),
                                children: t("modals.clearAllData.content"),
                                confirmProps: { color: "red" },
                                labels: {
                                    confirm: t("modals.clearAllData.confirm"),
                                    cancel: t("modals.cancel")
                                },
                                onConfirm() {
                                    processCommand({ type: "clearAllData" });
                                    notifications.show({
                                        message: t("notifs.deletedEverything"),
                                        color: "red",
                                    })
                                },
                            })
                        }}>
                        {t("deleteAllData")}
                    </Button>
                </Group>
            </Stack>
        </Fieldset>
    );
}
