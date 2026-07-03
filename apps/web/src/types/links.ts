export interface Link {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListLinks {
  pagination: Pagination
  data: Link[]
}

export interface SearchQuery {
  q?: string
  page?: number
  limit?: number
  order?: "asc" | "desc"
  orderBy?: "clicks" | "createdAt"
}
