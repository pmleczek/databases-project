import { ArrowRight } from "lucide-react";
import { useCallback, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription } from "@/components/ui/field";
import { LoginContext } from "@/context";

const LoginScreen = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  // @ts-expect-error -- No context verification
  const { setToken } = useContext(LoginContext);

  const handleSubmit = useCallback(async () => {
    setError("");

    if (!password) {
      setError("Podaj hasło");
      return;
    }

    const result = await fetch("/api/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!result.ok) {
      setError("Niepoprawne hasło");
      setPassword("");
    }

    const { token } = await result.json();
    setToken(token);
  }, [password, setToken]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-start">
        <Field data-invalid={error ? true : undefined}>
          <Input
            aria-invalid={error ? true : undefined}
            className="rounded-r-none"
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder="Hasło"
            type="password"
            value={password}
          />
          {error && (
            <FieldDescription className="text-red-400 font-medium">{error}</FieldDescription>
          )}
        </Field>
        <Button className="cursor-pointer rounded-l-none" onClick={handleSubmit}>
          Zaloguj się
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default LoginScreen;
