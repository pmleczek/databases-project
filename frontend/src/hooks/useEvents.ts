import { LoginContext } from "@/context";
import { atom, useAtom } from "jotai";
import { useCallback, useContext, useEffect } from "react";

const eventAtom = atom<object[]>([]);

export const useEvents = () => {
  // @ts-expect-error -- No context verification
  const { setToken, token } = useContext(LoginContext);
  const [events, setEvents] = useAtom(eventAtom);

  useEffect(() => {
    (async () => {
      const result = await fetch("/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        setToken(null);
      }

      const data = await result.json();
      setEvents(data.events);
    })();
  }, [token, setToken]);

  const update = useCallback(
    (id: number, newEvent: object) => {
      setEvents((prev) => {
        // @ts-expect-error -- No type verification
        const indexOf = prev.findIndex((event) => event.id === id);
        return [...prev.slice(0, indexOf), newEvent, ...prev.slice(indexOf + 1)];
      });
    },
    [setEvents],
  );

  return {
    events,
    update,
  };
};
