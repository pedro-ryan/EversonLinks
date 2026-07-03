import { Button } from "@repo/ui/components/button"
import { Card, CardContent } from "@repo/ui/components/card"
import { Spinner } from "@repo/ui/components/spinner"
import { useQuery } from "@tanstack/react-query"
import { Check, Copy, ExternalLink, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getLinks } from "../service/modules/links"
import type { Link } from "../types/links"
import { ListFilters } from "./list-filters"
import { ListPagination } from "./list-pagination"

interface ListCardProps {
  baseUrl: string
  onEdit: (link: Link) => void
  onDelete: (id: string) => void
}

export function ListCard({ baseUrl, onEdit, onDelete }: ListCardProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState<"createdAt" | "clicks">("createdAt")
  const [order, setOrder] = useState<"desc" | "asc">("desc")

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  // --- React Query ---
  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["links", debouncedSearch, page, orderBy, order],
    queryFn: () =>
      getLinks({ q: debouncedSearch, page, limit: 10, orderBy, order }),
  })

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Card className="border border-border bg-card">
      <CardContent className="flex flex-col gap-4 pt-6">
        <h2 className="text-lg font-semibold tracking-tight">Seus links</h2>

        {/* Filtros e Pesquisa */}
        <ListFilters
          search={search}
          onSearchChange={setSearch}
          orderBy={orderBy}
          onOrderByChange={(val) => {
            setOrderBy(val)
            setPage(1)
          }}
          order={order}
          onOrderChange={(val) => {
            setOrder(val)
            setPage(1)
          }}
        />

        {/* Lista de Links */}
        <div className="mt-2 flex flex-col gap-3">
          {isLinksLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <Spinner className="size-6 text-primary" />
              <span className="text-sm">Carregando links...</span>
            </div>
          ) : linksData?.data && linksData.data.length > 0 ? (
            linksData.data.map((link) => (
              <div
                key={link.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/10 p-4 transition-all hover:border-foreground/20"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {/* Short Link Line */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`${baseUrl}/${link.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-1 truncate font-mono text-sm font-medium text-sky-400 hover:underline"
                    >
                      {`${baseUrl}/${link.shortCode}`}
                      <ExternalLink className="size-3 shrink-0 opacity-60" />
                    </a>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() =>
                        handleCopy(link.id, `${baseUrl}/${link.shortCode}`)
                      }
                      className="text-muted-foreground hover:text-foreground"
                      title="Copiar link encurtado"
                    >
                      {copiedId === link.id ? (
                        <Check className="size-3 text-emerald-400" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>

                  {/* Original Link Line */}
                  <span
                    className="truncate text-xs text-muted-foreground"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </span>

                  {/* Clicks Info */}
                  <div className="mt-1 flex items-center">
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
                      {link.clicks} clicks
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onEdit(link)}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Editar link"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onDelete(link.id)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Excluir link"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
              {search
                ? "Nenhum link corresponde à busca"
                : "Nenhum link criado ainda"}
            </div>
          )}
        </div>

        {/* Paginação */}
        {linksData?.pagination && (
          <ListPagination
            page={page}
            totalPages={linksData.pagination.totalPages}
            total={linksData.pagination.total}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  )
}
