import { useEffect } from "react";

export function useInterval(callback: () => void, ms: number) {
  useEffect(() => {
    const timer = setInterval(callback, ms);
    return () => clearInterval(timer);
  }, []);
}
