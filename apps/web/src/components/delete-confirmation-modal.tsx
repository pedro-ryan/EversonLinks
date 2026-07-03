import { Button } from "@repo/ui/components/button"
import { Spinner } from "@repo/ui/components/spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLink } from "../service/modules/links"

interface DeleteConfirmationModalProps {
  id: string
  onClose: () => void
}

export function DeleteConfirmationModal({
  id,
  onClose,
}: DeleteConfirmationModalProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] })
      onClose()
    },
    onError: (err: any) => {
      alert(err.message || "Falha ao deletar o link")
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm animate-in rounded-xl border border-border bg-card p-5 shadow-2xl duration-150 zoom-in-95 fade-in">
        <h3 className="text-base font-semibold text-foreground">
          Excluir Link
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta ação é irreversível e o link curto deixará de funcionar. Tem
          certeza que deseja prosseguir?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate(id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Spinner className="mr-1.5" />
                Excluindo...
              </>
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
