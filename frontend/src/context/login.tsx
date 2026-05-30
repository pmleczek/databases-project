import { createContext, type ReactNode, useState } from "react";

export const LoginContext = createContext<{
  token: string | null;
  setToken: (token: string) => void;
} | null>(null);

export const LoginContextProvider = ({ children }: { children?: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  return <LoginContext.Provider value={{ token, setToken }}>{children}</LoginContext.Provider>;
};
