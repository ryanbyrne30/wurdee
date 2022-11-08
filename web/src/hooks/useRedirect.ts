import { useEffect } from "react"

export function useRedirect(dependency: boolean, redirect: string) {
  useEffect(() => {
    if (dependency) window.location.replace(redirect);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency])
}