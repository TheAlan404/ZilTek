import { Affix, Divider, SimpleGrid } from "@mantine/core";
import { ScheduleSection } from "./view/ScheduleSection";
import { ClockSection } from "./view/ClockSection";
import { ControlsSection } from "./view/ControlsSection";
import useMobile from "../../hooks/useMobile";

export const ViewPage = () => {
    const isMobile = useMobile();

    return (
        <>
            <SimpleGrid cols={{ base: 1, md: 3 }} p="md">
                {isMobile ? (
                    <>
                        <ClockSection />
                        <Divider w="100%" />
                        <ControlsSection />
                        <Divider w="100%" />
                        <ScheduleSection />
                    </>
                ) : (
                    <>
                        <ScheduleSection />
                        <ClockSection />
                        <ControlsSection />
                    </>
                )}
            </SimpleGrid>
        </>
    );
};
