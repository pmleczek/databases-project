import { LoginScreen } from "@/screens";
import { createContext, type ReactNode, useContext, useState } from "react";

const Router = () => {
  const authContext = useContext(LoginContext);
  const isAuthenticated = !!authContext?.token;
  return isAuthenticated ? <div /> : <LoginScreen />;
};

const App = () => {
  return (
    <LoginContextProvider>
      <Router />
    </LoginContextProvider>
  );
};

const LoginContext = createContext<{
  token: string | null;
  setToken: (token: string) => void;
} | null>(null);

const LoginContextProvider = ({ children }: { children?: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  return <LoginContext.Provider value={{ token, setToken }}>{children}</LoginContext.Provider>;
};

export default App;
