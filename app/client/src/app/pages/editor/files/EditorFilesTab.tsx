import { Flex, Stack } from "@mantine/core";
import { FilesSection } from "./FilesSection";
import { QuickMelodiesSection } from "./QuickMelodiesSection";
import useMobile from "../../../../hooks/useMobile";

export const EditorFilesTab = () => {
    const isMobile = useMobile();

    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
            <Stack w={{ base: "100%", md: "50%" }} align="center">
                <QuickMelodiesSection />
                <FilesSection />
            </Stack>
        </Flex>
    );
}
