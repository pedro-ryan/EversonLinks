import Elysia, { t } from "elysia"

export namespace LinksModel {
  // Schemas
  export const Link = t.Object({
    id: t.String(),
    originalUrl: t.String(),
    shortCode: t.String(),
    clicks: t.Number(),
    createdAt: t.Date(),
  })
  export type Link = typeof Link.static

  // Responses
  export const ListLinks = t.Object({
    pagination: t.Object({
      page: t.Number({ default: 1, minimum: 1 }),
      limit: t.Number({ default: 10, minimum: 1 }),
      total: t.Number(),
      totalPages: t.Number(),
    }),
    data: t.Array(LinksModel.Link),
  })
  export type ListLinks = typeof ListLinks.static

  // Body
  export const CreateLink = t.Object({
    originalUrl: t.String(),
  })
  export type CreateLink = typeof CreateLink.static

  export const UpdateLink = t.Object({
    originalUrl: t.String(),
  })
  export type UpdateLink = typeof UpdateLink.static

  // Params
  export const ShortCode = t.Object({
    shortCode: t.String(),
  })
  export type ShortCode = typeof ShortCode.static

  export const IdParams = t.Object({
    id: t.String(),
  })
  export type IdParams = typeof IdParams.static

  // Query
  export const SearchQuery = t.Object({
    q: t.Optional(t.String()),
    page: t.Optional(t.Number({ default: 1, minimum: 1 })),
    limit: t.Optional(t.Number({ default: 10, minimum: 1 })),
    order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
    orderBy: t.Optional(t.Union([t.Literal("clicks"), t.Literal("createdAt")])),
  })
  export type SearchQuery = typeof SearchQuery.static
}

export const LinkModels = new Elysia({ name: "LinksModel" }).model({
  "links.body.create": LinksModel.CreateLink,
  "links.body.update": LinksModel.UpdateLink,

  "links.response.created": LinksModel.Link,
  "links.response.list": LinksModel.ListLinks,
  "links.response.get": LinksModel.Link,

  "links.params.shortCode": LinksModel.ShortCode,
  "links.params.id": LinksModel.IdParams,

  "links.query.search": LinksModel.SearchQuery,
})
