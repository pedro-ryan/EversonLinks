import { isValidUrl } from "@/lib/utils"
import type { Link, ListLinks, SearchQuery } from "@/types/links"
import axios from "axios"
import api from "../api"

export async function createLink(url: string): Promise<Link> {
  if (!isValidUrl(url)) {
    throw new Error(
      "URL inválida. Certifique-se de incluir http:// ou https://"
    )
  }

  try {
    const { data } = await api.post<Link>("/api/links", { originalUrl: url })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Falha ao criar o link")
    }
    throw error
  }
}

export async function getLinks(query?: SearchQuery): Promise<ListLinks> {
  try {
    const { data } = await api.get<ListLinks>("/api/links", { params: query })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível carregar os links")
    }
    throw error
  }
}

export async function updateLink(id: string, url: string): Promise<Link> {
  if (!isValidUrl(url)) {
    throw new Error("URL inválida")
  }

  try {
    const { data } = await api.patch<Link>(`/api/links/${id}`, {
      originalUrl: url,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Link não encontrado")
      }
      throw new Error(
        error.response?.data?.message || "Falha ao atualizar o link"
      )
    }
    throw error
  }
}

export async function deleteLink(id: string): Promise<Link> {
  try {
    const { data } = await api.delete<Link>(`/api/links/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Link não encontrado")
      }
      throw new Error("Falha ao deletar o link")
    }
    throw error
  }
}
