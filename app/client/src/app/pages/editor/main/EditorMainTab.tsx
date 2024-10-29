import useMobile from "../../../../hooks/useMobile"
import { ActionIcon, Code, Fieldset, Flex, Group, Highlight, Stack, Tooltip } from "@mantine/core";
import { useContext, useState } from "react";
import { Controller } from "../../../../host/ControllerAPI";
import { RemoteControlSettings } from "./RemoteControlSettings";
import { MaintenanceSection } from "./MaintenanceSection";
import { UpdateChecker } from "./UpdateChecker";
import { HostContext } from "../../../../host/HostContext";
import { ZilTekSection } from "./ZilTekSection";
import { Time } from "@ziltek/common/src/Time";
import { TimeBox } from "../../../components/schedule/TimeBox";

export const EditorMainTab = () => {
    const { clientType } = useContext(HostContext);

    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
            <Stack w={{ base: "100%", md: "50%" }}>
                <ZilTekSection />
                {clientType == "host" && <RemoteControlSettings />}
                {clientType == "host" && <MaintenanceSection />}
            </Stack>
        </Flex>
    )
}


