import { EventScreen, LoginScreen } from "@/screens";
import { LoginContext, LoginContextProvider } from "@/context";
import { useContext } from "react";

const Router = () => {
  const authContext = useContext(LoginContext);
  const isAuthenticated = !!authContext?.token;
  return isAuthenticated ? <EventScreen /> : <LoginScreen />;
};

const App = () => {
  return (
    <LoginContextProvider>
      <Router />
    </LoginContextProvider>
  );
};

export default App;
