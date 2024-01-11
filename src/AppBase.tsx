import { Button, Center, Checkbox, Divider, Text, Paper, Stack, TextInput, Title, Group, Tooltip, ActionIcon, SegmentedControl } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconDownload, IconPencil, IconPlus } from "@tabler/icons-react";

import { LocalHost } from "./host/Local";
import { RemoteHost } from "./host/Remote";
import { NetworkingProvider } from "./host/Networking";
import { IndexedDB } from "react-indexed-db-hook";
import { DEFAULT_RELAY, DOWNLOAD_LINK, HOST_MODE_ALLOWED, MODE, REMOTE_MODE_ALLOWED, VERSION } from "./meta";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { LanguageSwitch } from "./app/components/LanguageSwitch";

interface Remote {
    id: string,
    label: string,
    relay: string,
}

const AppBase = () => {
    let [hostMode, setHostMode] = useLocalStorage({
        key: "ziltek-host-mode",
        defaultValue: "rc",
    });
    let [remotesList, setRemotesList] = useLocalStorage<Remote[]>({
        key: "ziltek-remotes-list",
        defaultValue: [],
    });
    let [connectTo, setConnectTo] = useState<Remote | null>(null);
    let [currentPage, setCurrentPage] = useState(hostMode == "local" ? "local" : "selection");
    let { t } = useTranslation();

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("ziltek-host-mode")) == "local") setCurrentPage("local");

        let params = new URLSearchParams(location.search);

        if (params.has("connect")) {
            let id = params.get("connect");
            setRemotesList((li) => li.some(x => x.id == id) ? li : [...li, {
                id,
                label: params.get("label") || "",
                relay: params.get("relay") || DEFAULT_RELAY,
            }])

            location.search = "";
        }
    }, []);

    return (
        currentPage == "selection" ? (
            <Center w="100%" h="100%">
                <Stack align="center" gap="xl" p="md" mt="md">
                    <Group justify="space-between" align="center" px="md" w="100%">
                        <Title>ZilTek {VERSION}</Title>
                        <LanguageSwitch />
                    </Group>

                    {HOST_MODE_ALLOWED && (<Group justify={"space-between"} align="center" p="md">
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
                    </Group>)}

                    {MODE === "WEB" && (
                        <Group justify="end" align="center" px="md" w="100%">
                            <Text>{t("download")}</Text>
                            <ActionIcon
                                component="a"
                                href={DOWNLOAD_LINK}
                                target="_blank"
                                color="green"
                                variant="light"
                            >
                                <IconDownload />
                            </ActionIcon>
                        </Group>
                    )}

                    {REMOTE_MODE_ALLOWED && (
                        <>
                            <Divider
                                w="80%"
                                labelPosition="center"
                                label={t("mode.remote.list")} />

                            <Text ta="center">{t("mode.remote.desc")}</Text>

                            <Stack w="100%">
                                {remotesList.map((r, i) => (
                                    <Paper withBorder m="md" p="md" key={i}>
                                        <Group justify="space-between">
                                            <Stack gap={0}>
                                                <Title order={4}>{r.label}</Title>
                                                <Text c="dimmed">{r.id}</Text>
                                                <Text c="dimmed">{r.relay}</Text>
                                            </Stack>
                                            <Group>
                                                <Tooltip label={t("mode.remote.edit")}>
                                                    <ActionIcon
                                                        variant="light"
                                                        color="gray"
                                                        onClick={() => {
                                                            modals.open({
                                                                title: t("modals.addRemote.title"),
                                                                children: <AddRemoteModal
                                                                    remote={r}
                                                                    onAdd={(r) => {
                                                                        setRemotesList(l => l.map((x, idx) => i === idx ? r : x));
                                                                    }}
                                                                    onDelete={() => {
                                                                        setRemotesList(l => l.filter((_, idx) => idx !== i));
                                                                    }}
                                                                />
                                                            })
                                                        }}>
                                                        <IconPencil />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label={t("mode.remote.connect")}>
                                                    <ActionIcon
                                                        variant="light"
                                                        color="green"
                                                        onClick={() => {
                                                            setConnectTo(r);
                                                            setCurrentPage("remote");
                                                        }}>
                                                        <IconArrowRight />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
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

                                                    if (r) setRemotesList(l => [...l, r]);
                                                }}
                                            />
                                        })
                                    }}>
                                    {t("mode.remote.add")}
                                </Button>
                            </Center>
                        </>
                    )}
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
                <RemoteHost
                    proxyUrl={connectTo?.relay}
                    hostId={connectTo?.id}
                    exitRemoteMode={() => {
                        setCurrentPage("selection");
                    }}
                />
            )
        )
    );
};

export const AddRemoteModal = ({
    remote,
    onAdd,
    onDelete,
}: {
    remote: Remote | null,
    onAdd: (n: Remote) => void,
    onDelete: (() => void) | null,
}) => {
    const { t } = useTranslation();
    const [label, setLabel] = useState(remote?.label);
    const [id, setId] = useState(remote?.id);
    const [relay, setRelay] = useState(remote?.relay || DEFAULT_RELAY);

    const add = () => {
        modals.closeAll();

        onAdd?.({
            id,
            label,
            relay,
        });
    };

    return (
        <Stack p="md" justify="center">
            <TextInput
                placeholder={t("modals.addRemote.placeholderName")}
                label={t("modals.addRemote.labelName")}
                value={label}
                onChange={(e) => setLabel(e.currentTarget.value)}
            />
            <TextInput
                autoFocus
                placeholder={t("modals.addRemote.placeholderId")}
                label={t("modals.addRemote.labelId")}
                value={id}
                onChange={(e) => setId(e.currentTarget.value)}
                onSubmit={add}
            />
            <TextInput
                placeholder={t("modals.addRemote.placeholderRelay")}
                label={t("modals.addRemote.labelRelay")}
                value={relay}
                onChange={(e) => setRelay(e.currentTarget.value)}
            />
            <Group justify="space-between" grow>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>
                {onDelete && (
                    <Button
                        color="red"
                        onClick={() => {
                            modals.openConfirmModal({
                                title: t("modals.deleteRemote.title"),
                                children: t("modals.deleteRemote.content"),
                                confirmProps: { color: "red" },
                                labels: {
                                    confirm: t("modals.deleteRemote.confirm"),
                                    cancel: t("modals.cancel")
                                },
                                onConfirm() {
                                    onDelete();
                                    modals.closeAll();
                                    notifications.show({
                                        message: t("notifs.deletedRemote"),
                                        color: "red",
                                    });
                                },
                            });
                        }}>
                        {t("modals.addRemote.delete")}
                    </Button>
                )}
                <Button onClick={add}>
                    {onDelete ? t("modals.addRemote.save") : t("modals.addRemote.add")}
                </Button>
            </Group>
        </Stack>
    );
}

export default AppBase;
