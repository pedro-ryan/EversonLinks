import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Spinner } from "@repo/ui/components/spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState } from "react"
import { updateLink } from "../service/modules/links"
import type { Link } from "../types/links"

interface EditModalProps {
  link: Link
  baseUrl: string
  onClose: () => void
}

export function EditModal({ link, baseUrl, onClose }: EditModalProps) {
  const queryClient = useQueryClient()
  const [editUrl, setEditUrl] = useState(link.originalUrl)
  const [editError, setEditError] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      updateLink(id, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] })
      onClose()
    },
    onError: (err: any) => {
      setEditError(err.message || "Falha ao atualizar o link")
    },
  })

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUrl.trim()) return
    updateMutation.mutate({ id: link.id, url: editUrl })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md animate-in rounded-xl border border-border bg-card p-6 shadow-2xl duration-150 zoom-in-95 fade-in">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-semibold text-foreground">
            Editar Link
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Link Curto atual:
            </span>
            <span className="font-mono text-sm text-sky-400">
              {`${baseUrl}/${link.shortCode}`}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="edit-url"
              className="text-xs font-medium text-muted-foreground"
            >
              Novo URL de destino:
            </Label>
            <Input
              id="edit-url"
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              disabled={updateMutation.isPending}
              className="border-border bg-muted/20"
              placeholder="https://example.com/novo-destino"
              autoFocus
            />
          </div>

          {editError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {editError}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                updateMutation.isPending ||
                !editUrl.trim() ||
                editUrl === link.originalUrl
              }
            >
              {updateMutation.isPending ? (
                <>
                  <Spinner className="mr-1.5" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
