import Elysia from "elysia"
import { LinkModels } from "../models/links.models"
import { LinksService } from "../services/links.service"

export const PublicRoutes = new Elysia()
  .use(LinkModels)
  .get("/s/:shortCode",
    async ({ params, status, redirect }) => {
      const { shortCode } = params
      const link = await LinksService.getLink(shortCode)

      if (!link) return status(404)

      return redirect(link.originalUrl, 302)
    },
    {
      params: "links.params.shortCode",
    }
)
