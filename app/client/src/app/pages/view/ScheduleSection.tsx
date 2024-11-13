import { useContext, useState } from "react"
import { Controller } from "../../../host/ctx/Controller"
import { match } from "@alan404/enum";
import { Schedule } from "@ziltek/common/src/schedule/Schedule";
import { TimetableComponent } from "../../components/schedule/TimetableComponent";
import { getTimetableLayers, overlayTimetables } from "@ziltek/common/src/schedule/timetable/Timetable";
import { useDate } from "../../../hooks/useClock";

export const ScheduleSection = () => {
    const { data } = useContext(Controller);
    const [dayOfWeek, setDayOfWeek] = useState(new Date().getDay());
    useDate((d) => setDayOfWeek(d.getDay()));

    return match<Schedule, React.ReactNode>(data.schedule)({
        Timetable: (schedule) => (
            <TimetableComponent
                value={overlayTimetables(getTimetableLayers(schedule, dayOfWeek))}
            />
        ),
        Zones: () => <></>,
    });
}
