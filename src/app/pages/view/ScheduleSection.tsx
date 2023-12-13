import { useContext } from "react"
import { ControllerAPI, Log } from "../../../host/ControllerAPI"
import { TimetableComponent } from "../../components/schedule/Timetable";
import { Entry, TimeBoxVariant, Timetable } from "../../../lib/timetable";
import { Time } from "../../../lib/time";

const eq = (a, b) => 
    (a[0] == b[0])
    && (a[1] == b[1]);

export const renderTimetableWithVariants = (table: Timetable, logs: Log[], currentlyPlayingBell) => {
    const getVariant = (x: number, y: number, entry: Entry): TimeBoxVariant => {
        let currentTime = Time(new Date());

        if(currentlyPlayingBell && eq(currentlyPlayingBell, [x, y, entry])) {
            return "playing";
        }

        let filtered = logs.filter(log => {
            return eq(log.data, [x, y, entry]);
        });
        console.log("---", filtered);

        if(filtered.some(log => log.type == "BELL_SUSPENDED")) return "suspended";
        if(filtered.some(log => log.type == "BELL_STOPPED")) return "interrupted";
        if(filtered.some(log => log.type == "BELL_PLAYED")) return "played";

        return "idle";
    };

    return table.map((tuple, x) => (
        tuple.map((entry, y) => (
            {
                value: entry.value,
                variant: getVariant(x, y, entry),
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
