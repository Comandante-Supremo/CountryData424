export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            ARINC 424 Data API
          </h1>
          <span className="rounded-sm bg-accent/20 px-2 py-0.5 font-mono text-xs text-accent">
            PHASE 1
          </span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">v0.1</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-muted-foreground">
          Server is running. Phase 1 scaffolding complete.
        </p>
      </main>
    </div>
  )
}
