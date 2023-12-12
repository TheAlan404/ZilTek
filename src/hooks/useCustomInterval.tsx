import { useEffect, useRef, useState } from "react";

export function useCustomInterval(fn: () => void, interval: number, deps) {
    useEffect(() => {
        console.log("useCustomInterval setup");
        let i = setInterval(fn, interval);
        return () => {
            console.log("useCustomInterval cleanup");
            clearInterval(i);
        };
    }, [fn, ...deps]);
}
