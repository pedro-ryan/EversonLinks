import { Prisma, prisma } from "@repo/db"
import { status } from "elysia"
import { nanoid } from "nanoid"
import { LinksModel } from "../models/links.models"
import { isValidUrl } from "../utils"

export abstract class LinksService {
  static async createLink(originalUrl: string): Promise<LinksModel.Link> {
    if (!isValidUrl(originalUrl)) {
      throw status(400, "Invalid URL format")
    }

    const shortCode = nanoid(6)

    const link = await prisma.link.create({
      data: {
        originalUrl,
        shortCode,
      },
    })

    return link
  }

  static async listLinks(
    params?: LinksModel.SearchQuery
  ): Promise<LinksModel.ListLinks> {
    const {
      q = "",
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "desc",
    } = params || {}

    const where: Prisma.LinkWhereInput = {}

    if (q) {
      where.OR = [
        { originalUrl: { contains: q } },
        { shortCode: { contains: q } },
      ]
    }

    const [links, count] = await prisma.$transaction([
      prisma.link.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          [orderBy]: order,
        },
      }),
      prisma.link.count({
        where,
      }),
    ])

    return {
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      data: links,
    }
  }

  static async getLink(shortCode: string): Promise<LinksModel.Link | null> {
    const link = await prisma.link.findUnique({
      where: {
        shortCode,
      },
    })

    if (!link) return null

    await prisma.link.update({
      where: {
        id: link.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })

    return link
  }

  static async deleteLink(id: string) {
    try {
      const link = await prisma.link.delete({
        where: {
          id,
        },
      })

      return link
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw status(404, "Link not found")
      }

      throw error
    }
  }

  static async updateLink(id: string, newUrl: string) {
    if (!isValidUrl(newUrl)) {
      throw status(400, "Invalid URL format")
    }

    try {
      const link = await prisma.link.update({
        where: {
          id,
        },
        data: {
          originalUrl: newUrl,
        },
      })
      return link
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw status(404, "Link not found")
      }

      throw error
    }
  }
}
