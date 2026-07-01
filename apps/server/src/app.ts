import { Elysia } from "elysia";
import { Router } from "./router";

const app = new Elysia().use(Router)

export { app }