import { Flex, Stack } from "@mantine/core";
import { useContext } from "react";
import { RemoteControlSettings } from "./RemoteControlSettings";
import { MaintenanceSection } from "./MaintenanceSection";
import { HostContext } from "../../../../host/ctx/HostContext";
import { ZilTekSection } from "./ZilTekSection";
import { DebugSection } from "./DebugSection";

export const EditorMainTab = () => {
    const { clientType } = useContext(HostContext);

    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
            <Stack w={{ base: "100%", md: "50%" }}>
                <ZilTekSection />
                {clientType == "host" && <RemoteControlSettings />}
                {clientType == "host" && <MaintenanceSection />}
                <DebugSection />
            </Stack>
        </Flex>
    )
}


