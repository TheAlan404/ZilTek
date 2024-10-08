import { useContext } from "react"
import { ControllerAPI, Log } from "../../../host/ControllerAPI"
import { TimetableComponent } from "../../components/schedule/Timetable";
import { Entry, TimeBoxVariant, Timetable } from "../../../lib/timetable";
import { Time, getVariant } from "@ziltek/common/src/Time";

export const renderTimetableWithVariants = (table: Timetable, logs: Log[], currentlyPlayingBell) => {
    return table.map((tuple, x) => (
        tuple.map((entry, y) => (
            {
                value: entry.value,
                variant: getVariant({
                    table,
                    logs,
                    currentlyPlayingBell,
                    x,
                    y,
                    entry,
                }),
            }
        ))
    ))
}

export const ScheduleSection = () => {
    const {
        renderedSchedule,
        logs,
        currentlyPlayingBell,
    } = useContext(ControllerAPI);
    if(!renderedSchedule) return <></>;

    let schedule = renderTimetableWithVariants(renderedSchedule, logs, currentlyPlayingBell);

    return (
        <TimetableComponent
            variant="readonly"
            value={schedule}
        />
    )
}
