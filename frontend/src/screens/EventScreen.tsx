import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEvents, useRegister } from "@/hooks";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const EventScreen = () => {
  const { events } = useEvents();

  return (
    <div className="h-screen flex items-start justify-center pt-8">
      <div className="w-full max-w-7xl flex items-start justify-evenly">
        {events.map((event) => (
          // @ts-expect-error
          <EventList key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventScreen;

const EventList = ({ event }: { event: object }) => {
  const [username, setUsername] = useState("");
  const ref = useRef<HTMLButtonElement>(null);

  const register = useRegister();
  const handleRegister = useCallback(async () => {
    if (username) {
      // @ts-expect-error
      await register(event.id, username);
      if (ref.current) {
        ref.current.click();
      }
    }
    // @ts-expect-error
  }, [event.id, register, username]);

  const resetModal = () => {
    setUsername("");
  };

  return (
    <Dialog>
      <div className="bg-accent rounded-md">
        <div
          className={clsx(
            "px-6 py-4 flex items-center justify-between gap-6",
            /* @ts-expect-error -- Missing type annotations */
            event.registrations && event.registrations.length && "border-b border-border",
          )}
        >
          {/* @ts-expect-error -- Missing type annotations */}
          {event.name}
          <DialogTrigger asChild>
            <Button ref={ref} className="text-xs cursor-pointer" onClick={resetModal}>
              Zapisz się
              <Plus />
            </Button>
          </DialogTrigger>
        </div>
        {/* @ts-expect-error -- Missing type annotations */}
        {event.registrations && (
          <div>
            {/* @ts-expect-error -- Missing type annotations */}
            {event.registrations.map((registration) => (
              <div className="px-6 py-2 border-b border-border last:border-none">
                <span>{registration.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zapisz się</DialogTitle>
          <DialogDescription>
            {/* @ts-expect-error -- Missing type annotations */}
            Zapisz się na wydarzenie: {event.name}
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>Nazwa użytkownika</FieldLabel>
          <Input onChange={({ target: { value } }) => setUsername(value)} value={username} />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Anuluj</Button>
          </DialogClose>
          <Button onClick={handleRegister}>
            Zapisz się
            <Plus />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
