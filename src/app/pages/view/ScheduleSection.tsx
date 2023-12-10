import { useContext } from "react"
import { ControllerAPI } from "../../../host/ControllerAPI"
import { TimetableComponent } from "../../components/schedule/Timetable";

export const ScheduleSection = () => {
    const { renderedSchedule } = useContext(ControllerAPI);

    return (
        <TimetableComponent
            variant="readonly"
            value={renderedSchedule}
        />
    )
}
