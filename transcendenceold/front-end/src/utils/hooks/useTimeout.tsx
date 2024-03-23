import { useCallback, useEffect, useRef } from "react";

const useTimeout = (callback: any, delay: any) => {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<any>();

    // EVERYTIME OUR CALLBACK CHANGES: WE ARE UPDATING OUR CALLBACK REF
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // IF WE CHANGE THE DELAY WE GONNA RESET OUR TIMEOUT
    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    }, [delay]);

    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        // console.log("clear called");
    }, []);

    useEffect(() => {
        set();

        // CLEAR OUT THE TIMEOUT BEFORE RESTART IT AGAIN
        return clear;
    }, [delay, set, clear]);

    const reset = useCallback(() => {
        clear();
        set();
        // console.log("reset called");
    }, [clear, set]);

    return { clear, reset };
};

export default useTimeout;
