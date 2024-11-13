import { Time, TimeFromDate } from "@ziltek/common/src/Time";
import { useEffect } from "react";

const SECOND = 1000;

export const useDate = (fn: (date: Date) => void) => {
    useEffect(() => {
        const update = () => {
            fn(new Date());
        };

        const handle = setInterval(update, SECOND);
        return () => clearInterval(handle);
    }, []);
};

export const useCurrentTime = (fn: (time: Time) => void) => {
    useDate((date) => fn(TimeFromDate(date)));
};

export const useDailyClock = ({
    onNewDay,
    onTick,
}: {
    onNewDay: (dayOfWeek: number) => void;
    onTick: (time: Time) => void;
}) => {
    useEffect(() => {
        let _day = new Date().getDay();

        const update = () => {
            const date = new Date();
            let currentDay = date.getDay();
            if(currentDay !== _day)
                onNewDay(currentDay);
            onTick(TimeFromDate(date));
        };

        const handle = setInterval(update, SECOND);
        return () => clearInterval(handle);
    }, [onNewDay, onTick]);
};
