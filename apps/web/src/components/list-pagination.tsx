import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination"

interface ListPaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function ListPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: ListPaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers
  const pageNumbers: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i)
    } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
      pageNumbers.push("...")
    }
  }

  return (
    <Pagination className="mt-4 border-t border-border pt-4">
      <PaginationContent className="flex w-full items-center justify-between">
        <PaginationItem className="mr-auto">
          <span className="text-xs text-muted-foreground">
            Total de {total} link{total !== 1 ? "s" : ""}
          </span>
        </PaginationItem>
        <div className="flex items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              text="Anterior"
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            return (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={page === p}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(p as number)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) onPageChange(page + 1)
              }}
              text="Próximo"
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  )
}
