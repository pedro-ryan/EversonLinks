import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"
import { Search } from "lucide-react"

interface ListFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  orderBy: "createdAt" | "clicks"
  onOrderByChange: (value: "createdAt" | "clicks") => void
  order: "desc" | "asc"
  onOrderChange: (value: "desc" | "asc") => void
}

export function ListFilters({
  search,
  onSearchChange,
  orderBy,
  onOrderByChange,
  order,
  onOrderChange,
}: ListFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Input de Pesquisa */}
      <div className="relative">
        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="pesquisar link"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-border bg-muted/20 pl-9"
        />
      </div>

      {/* Filtros de Ordenação */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="orderBy" className="text-xs text-muted-foreground">
            Ordenar por
          </Label>
          <Select
            value={orderBy}
            onValueChange={(val) =>
              onOrderByChange(val as "createdAt" | "clicks")
            }
          >
            <SelectTrigger id="orderBy" className="w-full text-xs">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-popover text-popover-foreground"
            >
              <SelectItem value="createdAt">Data de criação</SelectItem>
              <SelectItem value="clicks">Cliques</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order" className="text-xs text-muted-foreground">
            Ordem
          </Label>
          <Select
            value={order}
            onValueChange={(val) => onOrderChange(val as "desc" | "asc")}
          >
            <SelectTrigger id="order" className="w-full text-xs">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-popover text-popover-foreground"
            >
              <SelectItem value="desc">Decrescente</SelectItem>
              <SelectItem value="asc">Crescente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
