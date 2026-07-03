import { Button } from "@repo/ui/components/button"
import { Card, CardContent } from "@repo/ui/components/card"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Spinner } from "@repo/ui/components/spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertCircle, Check, Copy, X } from "lucide-react"
import { useState } from "react"
import { createLink } from "../service/modules/links"
import type { Link } from "../types/links"

interface CreateCardProps {
  baseUrl: string
}

export function CreateCard({ baseUrl }: CreateCardProps) {
  const queryClient = useQueryClient()
  const [newUrl, setNewUrl] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [successLink, setSuccessLink] = useState<Link | null>(null)

  const createMutation = useMutation({
    mutationFn: createLink,
    onSuccess: (data) => {
      setSuccessLink(data)
      setCreateError(null)
      setNewUrl("")
      queryClient.invalidateQueries({ queryKey: ["links"] })
    },
    onError: (err: any) => {
      setCreateError(err.message || "Falha ao criar o link")
      setSuccessLink(null)
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim()) return
    createMutation.mutate(newUrl)
  }

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
        <h2 className="text-lg font-semibold tracking-tight">
          Criar seu link Curto
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url" className="text-xs text-muted-foreground">
              insira o URL de destino:
            </Label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com/um-link-longo"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              disabled={createMutation.isPending}
              className="border-border bg-muted/20 focus-visible:ring-primary/30"
            />
          </div>
          <Button
            type="submit"
            disabled={createMutation.isPending || !newUrl.trim()}
            className="w-full font-medium"
          >
            {createMutation.isPending ? (
              <>
                <Spinner className="mr-2" />
                Criando...
              </>
            ) : (
              "Criar seu link"
            )}
          </Button>
        </form>

        {/* Banner de Feedback (Sucesso) */}
        {successLink && (
          <div className="mt-2 flex flex-col gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                Link criado com sucesso!
              </span>
              <button
                onClick={() => setSuccessLink(null)}
                className="text-emerald-400 transition-colors hover:text-emerald-300"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded border border-emerald-500/20 bg-black/20 p-2">
              <span className="scrollbar-thin flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap select-all">
                {`${baseUrl}/${successLink.shortCode}`}
              </span>
              <Button
                size="xs"
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                onClick={() =>
                  handleCopy("success", `${baseUrl}/${successLink.shortCode}`)
                }
              >
                {copiedId === "success" ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Banner de Feedback (Erro) */}
        {createError && (
          <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Falha na criação</span>
                <button
                  onClick={() => setCreateError(null)}
                  className="text-destructive hover:opacity-80"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-0.5 text-sm">{createError}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
