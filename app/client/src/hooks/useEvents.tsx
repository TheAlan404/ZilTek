import { useEffect, useRef } from "react";

export type ListenerOf<I extends Record<string, any>> = {
    [P in keyof I]: [P, I[P]]
}[keyof I];

export type EmitOf<I extends Record<string, any>> = {
    [P in keyof I]: [P, ...Parameters<I[P]>]
}[keyof I]; 

export type BaseEventMap = Record<string, (..._: any[]) => void>;

export type EventEmitter<EventMap extends BaseEventMap> = {
    on: (...a: ListenerOf<EventMap>) => void;
    off: (...a: ListenerOf<EventMap>) => void;
    emit: (...a: EmitOf<EventMap>) => void;
};

export const useEventEmitter = <EventMap extends BaseEventMap>(): EventEmitter<EventMap> => {
    const callbacks = useRef<Partial<{ [Ty in keyof EventMap]: Set<EventMap[Ty]> }>>({});

    const on = (...[e, fn]: ListenerOf<EventMap>) => {
        if(!callbacks.current[e]) callbacks.current[e] = new Set();
        callbacks.current[e].add(fn);
    };
    
    const off = (...[e, fn]: ListenerOf<EventMap>) => {
        if(!callbacks.current[e]) callbacks.current[e] = new Set();
        callbacks.current[e].delete(fn);
    };

    const emit = (...[e, ...d]: EmitOf<EventMap>) => {
        if(!callbacks.current[e]) return;
        callbacks.current[e].forEach((fn) => fn(...d));
    };

    return {
        on,
        off,
        emit,
    };
};

export const useEventListener = <EventMap extends BaseEventMap>(emitter: EventEmitter<EventMap>, ...[e, fn]: ListenerOf<EventMap>) => {
    useEffect(() => {
        emitter.on(e, fn);
        return () => emitter.off(e, fn);
    }, [e, fn]);
};
