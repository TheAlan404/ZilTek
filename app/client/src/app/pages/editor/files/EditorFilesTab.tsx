import { Flex, Stack } from "@mantine/core";
import { FilesSection } from "./FilesSection";
import { QuickMelodiesSection } from "./QuickMelodiesSection";

export const EditorFilesTab = () => {
    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
            <Stack>
                <QuickMelodiesSection />
                <FilesSection />
            </Stack>
        </Flex>
    );
}
