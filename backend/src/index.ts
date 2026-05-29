import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";
import { jwt } from "@elysia/jwt";
import { Logestic } from "logestic";

const APP_PASSWORD = process.env.APP_PASSWORD ?? "p";
const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

const app = new Elysia()
  .use(Logestic.preset("fancy"))
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
    ({ body, jwt, set }) => {
      if (body.password === APP_PASSWORD) {
        const token = jwt.sign({});
        set.status = 200;
        return { token };
      } else {
        set.status = 401;
        return { error: "incorrect_password" };
      }
    },
    { body: t.Object({ password: t.String() }) },
  )
  .get("/", () => new Response(Bun.file("public/index.html")))
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
