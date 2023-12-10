import { SimpleGrid } from "@mantine/core";
import { ScheduleSection } from "./view/ScheduleSection";
import { ClockSection } from "./view/ClockSection";
import { ControlsSection } from "./view/ControlsSection";

export const ViewPage = () => {
    return (
        <SimpleGrid cols={{ base: 1, md: 3 }} p="md">
            <ScheduleSection />
            <ClockSection />
            <ControlsSection />
        </SimpleGrid>
    );
};
