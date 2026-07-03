import { Link2 } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Link2 className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">EversonLinks</h1>
          <p className="text-xs text-muted-foreground">Encurtador de links</p>
        </div>
      </div>
      <div className="rounded border border-border bg-muted/30 px-2 py-1 font-mono text-xs text-muted-foreground">
        Altere tema com{" "}
        <kbd className="rounded border border-border bg-muted px-1 font-sans font-bold">
          D
        </kbd>
      </div>
    </header>
  )
}
