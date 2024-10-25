import { Fieldset, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { BellType } from "@ziltek/common/src/schedule/timetable/BellType";
import { MelodySelect } from "../../../../components/editor/MelodySelect";
import { TimetableSchedule } from "@ziltek/common/src/schedule/timetable/TimetableSchedule";
import { useTranslation } from "react-i18next";

export const TimetableMelodies = ({
    schedule,
    setSchedule,
}: {
    schedule: TimetableSchedule;
    setSchedule: (schedule: TimetableSchedule) => void;
}) => {
    const [t] = useTranslation();

    return (
        <Fieldset legend={""}>
            <Stack>
                {(["students", "teachers", "classEnd"] as BellType[]).map((type) => (
                    <Group grow key={type}>
                        <Text>
                            {t(`bells.${type}`)}
                        </Text>

                        <MelodySelect
                            value={schedule.melodies.default[type]}
                            onChange={(melody) => {
                                setSchedule({
                                    ...schedule,
                                    melodies: {
                                        ...schedule.melodies,
                                        [type]: melody,
                                    },
                                });
                            }}
                        />
                    </Group>
                ))}
            </Stack>
        </Fieldset>
    )
};
