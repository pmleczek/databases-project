import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";
import { jwt } from "@elysia/jwt";
import { Logestic } from "logestic";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient, Registration } from "../generated/prisma/client";

const APP_PASSWORD = process.env.APP_PASSWORD ?? "p";
const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

const adapter = new PrismaMariaDb({
  host: "mysql",
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const prisma = new PrismaClient({ adapter });

const app = new Elysia()
  // .use(Logestic.preset("fancy"))
  .use(cors())
  .use(staticPlugin({ assets: "./public", prefix: "" }))
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: "7d",
    }),
  )
  /* API */
  .post(
    "/api/sign-in",
    async ({ body, jwt, set }) => {
      if (body.password === APP_PASSWORD) {
        const token = await jwt.sign({ iss: "app" });
        set.status = 200;
        return { token };
      } else {
        set.status = 401;
        return { error: "incorrect_password" };
      }
    },
    { body: t.Object({ password: t.String() }) },
  )
  .get("/api/events", async ({ headers, jwt, set }) => {
    const token = headers.authorization?.substring(7);
    if (!token || !(await jwt.verify(token, { issuer: "app" }))) {
      set.status = 401;
      return { error: "invalid_token" };
    }

    const events = await prisma.event.findMany();
    const registrations = await prisma.registration.findMany();
    const groupedByRegistrations = registrations.reduce<Record<number, Registration[]>>(
      (prev, curr) => {
        if (curr.eventId in prev) {
          prev[curr.eventId] = [...prev[curr.eventId], curr];
        } else {
          prev[curr.eventId] = [curr];
        }
        return prev;
      },
      {},
    );
    set.status = 200;
    return {
      events: events.map((event) => ({
        ...event,
        registrations: groupedByRegistrations[event.id],
      })),
    };
  })
  .get("/api/events/:id", async ({ headers, jwt, params: { id }, set }) => {
    const token = headers.authorization?.substring(7);
    if (!token || !(await jwt.verify(token, { issuer: "app" }))) {
      set.status = 401;
      return { error: "invalid_token" };
    }

    const event = await prisma.event.findFirstOrThrow({ where: { id: Number.parseInt(id) } });
    const registrations = await prisma.registration.findMany({ where: { eventId: event.id } });
    set.status = 200;
    return { event: { ...event, registrations } };
  })
  .post(
    "/api/register",
    async ({ body, headers, jwt, redirect, set }) => {
      const token = headers.authorization?.substring(7);
      if (!token || !(await jwt.verify(token, { issuer: "app" }))) {
        set.status = 401;
        return { error: "invalid_token" };
      }

      try {
        await prisma.registration.create({
          data: {
            eventId: body.eventId,
            username: body.username,
          },
        });
      } catch (_error) {
        set.status = 500;
        return { error: "unknown_error" };
      }

      const event = await prisma.event.findFirstOrThrow({ where: { id: body.eventId } });
      const registrations = await prisma.registration.findMany({ where: { eventId: event.id } });
      set.status = 200;
      return { event: { ...event, registrations } };
    },
    {
      body: t.Object({
        eventId: t.Number(),
        username: t.String(),
      }),
    },
  )
  /* STATIC */
  .get("/", () => new Response(Bun.file("public/index.html")))
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
