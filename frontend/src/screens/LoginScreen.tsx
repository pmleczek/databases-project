import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription } from "@/components/ui/field";

const LoginScreen = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(async () => {
    setError("");

    if (!password) {
      setError("Podaj hasło");
      return;
    }

    console.log("Logging in...");
  }, [password]);

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
