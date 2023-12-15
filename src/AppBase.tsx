import { Button, Center, Checkbox, Divider, Text, Paper, Stack, TextInput, Title, Group, Tooltip, ActionIcon } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { LocalHost } from "./host/Local";
import { RemoteHost } from "./host/Remote";
import { NetworkingProvider } from "./host/Networking";
import { IndexedDB } from "react-indexed-db-hook";
import { VERSION } from "./meta";
import { modals } from "@mantine/modals";

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
    let [connectTo, setConnectTo] = useState(null);
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
                                        <Title order={4}>{r.label}</Title>
                                        <Text c="dimmed">{r.id}</Text>
                                    </Stack>
                                    <Tooltip label={t("mode.remote.connect")}>
                                        <ActionIcon
                                            variant="light"
                                            color="green"
                                            onClick={() => {
                                                setConnectTo(r.id);
                                                setCurrentPage("remote");
                                            }}>
                                            <IconArrowRight />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>

                    <Center>
                        <Button
                            variant="light"
                            color="gray"
                            leftSection={<IconPlus />}
                            onClick={() => {
                                modals.open({
                                    title: t("modals.addRemote.title"),
                                    children: <AddRemoteModal
                                        onAdd={(r) => {
                                            modals.closeAll();

                                            setRemotesList(l => [...l, {
                                                label: r,
                                                id: r,
                                            }])
                                        }}
                                    />
                                })
                            }}>
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
                    proxyUrl={proxyUrl}
                    exitLocalMode={() => {
                        setHostMode("rc");
                        setCurrentPage("selection");
                    }}
                />
            ) : (
                <RemoteHost
                    proxyUrl={proxyUrl}
                    hostId={connectTo}
                    exitRemoteMode={() => {
                        setCurrentPage("selection");
                    }}
                />
            )
        )
    );
};

export const AddRemoteModal = ({
    onAdd,
}: {
    onAdd: (n: string) => void,
}) => {
    const { t } = useTranslation();
    const [id, setId] = useState();

    const add = () => onAdd?.(id);

    return (
        <Stack p="md" justify="center" align="">
            <TextInput
                autoFocus
                placeholder={t("modals.addRemote.placeholder")}
                label={t("modals.addRemote.label")}
                value={id}
                onChange={(e) => setId(e.currentTarget.value)}
                onSubmit={add}
            />
            <Group>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>
                <Button onClick={add}>
                    {t("modals.addRemote.add")}
                </Button>
            </Group>
        </Stack>
    );
}

export default AppBase;
