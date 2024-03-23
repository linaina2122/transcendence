import { useEffect } from "react";
import useTimeout from "./useTimeout";

const useDebounce = (callback: any, delay: number, dependencies: any[]) => {
    const { reset, clear } = useTimeout(callback, delay);

    // IF THE DEPENDENCIES CHANGES THEN RESET THE TIMEOUT
    useEffect(reset, [...dependencies, reset]);

    // CLEAR THE TIMEOUT AT THE FIRST TIME
    useEffect(clear, []);
};

export default useDebounce;