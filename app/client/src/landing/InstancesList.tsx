import { ActionIcon, Button, Center, Divider, Group, Paper, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Instance } from "./instance";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconArrowRight, IconPencil, IconPlus } from "@tabler/icons-react";
import { InstanceModal } from "./InstanceModal";
import { applyListAction, ListAction } from "@ziltek/common/src/ListAction";
import { useEffect } from "react";
import { DEFAULT_RELAY } from "../meta";
import { InstanceCard } from "./InstanceCard";

export const InstancesList = ({
    onConnect,
}: {
    onConnect: (instance: Instance) => void;
}) => {
    const [t] = useTranslation();

    let [instances, setInstances] = useLocalStorage<Instance[]>({
        key: "ziltek-remotes-list",
        defaultValue: [],
    });

    const add = (inst: Instance) => {
        if(instances.some(x => x.id == inst.id)) return;

        setInstances(applyListAction<Instance>(instances, ListAction<Instance>().Add(inst)));
    };

    useEffect(() => {
        let params = new URLSearchParams(location.search);

        if (params.has("connect")) {
            const inst: Instance = {
                id: params.get("connect")!,
                label: params.get("label") || "",
                relay: params.get("relay") || DEFAULT_RELAY,
            };
            add(inst);
            onConnect(inst);
            location.search = "";
        }
    }, []);

    return (
        <Stack w="100%" align="center">
            <Divider
                w="80%"
                labelPosition="center"
                label={t("mode.remote.list")}
            />

            <Text ta="center">
                {t("mode.remote.desc")}
            </Text>

            <Stack w="100%">
                {instances.map((instance, index) => (
                    <InstanceCard
                        instance={instance}
                        onConnect={() => onConnect(instance)}
                        onEdit={() => modals.open({
                            title: t("modals.addRemote.title"),
                            children: <InstanceModal
                                instance={instance}
                                onUpdate={(value) => {
                                    setInstances(applyListAction<Instance>(instances, ListAction<Instance>().Modify({ index, value })))
                                }}
                                onDelete={() => {
                                    setInstances(applyListAction<Instance>(instances, ListAction<Instance>().Remove(index)))
                                }}
                            />
                        })}
                        key={index}
                    />
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
                            children: <InstanceModal
                                onUpdate={add}
                            />
                        })
                    }}>
                    {t("mode.remote.add")}
                </Button>
            </Center>
        </Stack>
    )
};
