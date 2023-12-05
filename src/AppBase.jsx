import { Button, Center, Checkbox, Divider, Text, Paper, Stack, TextInput, Title, Group, Tooltip, ActionIcon } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { LocalHost } from "./host/Local";

export const VERSION = "v2-dev";

const AppBase = () => {
    let [hostMode, setHostMode] = useLocalStorage({
        key: "ziltek-host-mode",
        defaultValue: "rc",
    });
    let [remotesList, setRemotesList] = useLocalStorage({
        key: "ziltek-remotes-list",
        defaultValue: [],
    });
    let [proxyUrl, setProxyUrl] = useLocalStorage({
        key: "ziltek-proxy-url",
        defaultValue: "",
    });
    let [currentPage, setCurrentPage] = useState(hostMode == "local" ? "local" : "selection");
    let { t } = useTranslation();

    useEffect(() => {
        if(JSON.parse(localStorage.getItem("ziltek-host-mode")) == "local") setCurrentPage("local");
    }, []);

    return (
        currentPage == "selection" ? (
            <Center w="100%" h="100%">
                <Stack align="center" gap="xl" p="md">
                    <Title>ZilTek {VERSION}</Title>

                    <Group justify="space-between" align="center" p="md">
                        <Checkbox
                            checked={hostMode == "local"}
                            onChange={(e) => setHostMode(e.currentTarget.checked ? "local" : "rc")}
                            label={t("mode.local.checkbox")}
                            description={t("mode.local.desc")}
                        />

                        <Button
                            variant="light"
                            color="green"
                            rightSection={<IconArrowRight />}
                            onClick={() => {
                                setCurrentPage("local")
                            }}>
                            {t("mode.local.button")}
                        </Button>
                    </Group>

                    <Divider
                        w="80%"
                        labelPosition="center"
                        label={t("mode.remote.list")} />

                    <Text>{t("mode.remote.desc")}</Text>

                    <Stack>
                        {remotesList.map((r, i) => (
                            <Paper withBorder m="md" p="md" key={i}>
                                <Group justify="space-between">
                                    <Stack>
                                        <Title order={3}>{r.label}</Title>
                                        <Text c="dimmed">{r.id}</Text>
                                    </Stack>
                                    <Tooltip label={t("mode.remote.connect")}>
                                        <ActionIcon variant="light" color="green">
                                            <IconArrowRight />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>

                    <Center>
                        <Button variant="light" color="gray" leftSection={<IconPlus />}>
                            {t("mode.remote.add")}
                        </Button>
                    </Center>

                    <Paper withBorder p="md">
                        <TextInput
                            label={t("mode.proxyurl")}
                            value={proxyUrl}
                            onChange={(e) => setProxyUrl(e.currentTarget.value)}
                        />
                    </Paper>
                </Stack>
            </Center>
        ) : (
            currentPage == "local" ? (
                <LocalHost
                    exitLocalMode={() => {
                        setHostMode("rc");
                        setCurrentPage("selection");
                    }}
                />
            ) : (
                <></>
            )
        )
    );
};

export default AppBase;