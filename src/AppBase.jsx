import { Button, Center, Checkbox, Divider, Text, Paper, Stack, TextInput, Title, Group, Tooltip, ActionIcon } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { LocalHost } from "./host/Local";

const VERSION = "v2-dev";

const AppBase = () => {
    let [hostMode, setHostMode] = useLocalStorage({
        key: "ziltek-host-mode",
        defaultValue: "rc",
    });
    let [remotesList, setRemotesList] = useLocalStorage({
        key: "ziltek-remotes-list",
        defaultValue: [],
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    });
    let [proxyUrl, setProxyUrl] = useLocalStorage({
        key: "ziltek-proxy-url",
        defaultValue: "",
    });
    let [currentPage, setCurrentPage] = useState(hostMode == "local" ? "local" : "selection");
    let { t } = useTranslation();

    return (
        currentPage == "selection" ? (
            <Center w="100%" h="100%">
                <Stack align="center" gap="xl" py="md">
                    <Title>ZilTek {VERSION}</Title>

                    <Checkbox
                        checked={hostMode == "local"}
                        onChange={(e) => setHostMode(e.currentTarget.checked ? "local" : "rc")}
                        label={t("mode.local.checkbox")}
                        description={t("mode.local.desc")}
                        />

                    <Button
                        onClick={() => {
                            setCurrentPage("local")
                        }}>
                        {t("mode.local.button")}
                    </Button>

                    <Divider labelPosition="center" label={t("mode.remote.list")} />

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