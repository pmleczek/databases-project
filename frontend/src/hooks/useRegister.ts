import { LoginContext } from "@/context";
import { useCallback, useContext } from "react";
import { useEvents } from "./useEvents";

export const useRegister = () => {
  // @ts-expect-error -- No context verification
  const { token } = useContext(LoginContext);
  const { update } = useEvents();

  const register = useCallback(
    async (eventId: number, username: string) => {
      const result = await fetch("/api/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          username,
        }),
      });
      if (result.ok) {
        const data = await result.json();
        update(eventId, data.event);
      }
    },
    [token, update],
  );

  return register;
};
