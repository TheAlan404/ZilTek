import { useTranslation } from "react-i18next";
import { VERSION } from "../../../../meta";
import { ActionIcon, Button, Group, Loader, Text, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconDownload, IconInfoCircle, IconReload } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const UPDATE_URL = "https://raw.githack.com/TheAlan404/ZilTekProject/main/metadata.json";

export type UpdateInfo = {
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

export const UpdateChecker = () => {
    let { t } = useTranslation();
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({ status: "checking" });

    useEffect(() => {
        if (updateInfo.status == "checking") {
            (async () => {
                let res = await fetch(UPDATE_URL);
                let json = await res.json();
                console.log(json);
                if (json.latestVersion == VERSION) {
                    setUpdateInfo({
                        status: "upToDate"
                    });
                } else {
                    setUpdateInfo({
                        lastVersion: json.latestVersion,
                        url: json.url,
                        status: "outdated",
                    });
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
    );
};
