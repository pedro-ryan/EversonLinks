import { Elysia } from "elysia"
import { LinkModels } from "../models/links.models"
import { LinksService } from "../services/links.service"

export const LinksRoutes = new Elysia({
  prefix: "/api/links",
})
  .use(LinkModels)
  .post(
    "/",
    async ({ body, status }) => {
      const { originalUrl } = body
      const link = await LinksService.createLink(originalUrl)
      return status(201, link)
    },
    {
      body: "links.body.create",
      response: {
        201: "links.response.created",
      },
    }
  )
  .get(
    "/",
    ({ query }) => {
      return LinksService.listLinks(query)
    },
    {
      query: "links.query.search",
      response: {
        200: "links.response.list",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const { id } = params
      await LinksService.deleteLink(id)
      return status(204)
    },
    {
      params: "links.params.id",
    }
  )
  .patch(
    "/:id",
    async ({ params, body, status }) => {
      const { id } = params
      const { originalUrl } = body
      const link = await LinksService.updateLink(id, originalUrl)
      return status(200, link)
    },
    {
      params: "links.params.id",
      body: "links.body.update",
    }
  )
