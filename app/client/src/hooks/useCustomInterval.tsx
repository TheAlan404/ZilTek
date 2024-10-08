import { useEffect, useRef, useState } from "react";

export function useCustomInterval(fn: () => void, interval: number, deps) {
    useEffect(() => {
        let i = setInterval(fn, interval);
        return () => {
            clearInterval(i);
        };
    }, [fn, ...deps]);
}
