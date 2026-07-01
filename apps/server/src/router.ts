import Elysia from "elysia"
import { LinksRoutes } from "./routes/links.routes"
import { PublicRoutes } from "./routes/public.routes"

export const Router = new Elysia().use(LinksRoutes).use(PublicRoutes)
