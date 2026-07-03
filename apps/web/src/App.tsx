import { useState } from "react"
import { Header } from "./components/header"
import { CreateCard } from "./components/create-card"
import { ListCard } from "./components/list-card"
import { DeleteConfirmationModal } from "./components/delete-confirmation-modal"
import { EditModal } from "./components/edit-modal"
import type { Link } from "./types/links"

export function App() {
  const baseUrl = `${window.location.origin}/s`

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Link | null>(null)

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-12 text-foreground transition-colors duration-200">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <Header />

        <CreateCard baseUrl={baseUrl} />

        <ListCard
          baseUrl={baseUrl}
          onEdit={setEditTarget}
          onDelete={setDeleteTargetId}
        />

        {deleteTargetId && (
          <DeleteConfirmationModal
            id={deleteTargetId}
            onClose={() => setDeleteTargetId(null)}
          />
        )}

        {editTarget && (
          <EditModal
            link={editTarget}
            baseUrl={baseUrl}
            onClose={() => setEditTarget(null)}
          />
        )}
      </div>
    </div>
  )
}
