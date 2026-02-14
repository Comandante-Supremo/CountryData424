"use client"

import { useEffect, useState } from "react"
import { DiscoverySummary } from "@/components/discovery-summary"
import { DiscoveryTable } from "@/components/discovery-table"

interface Summary {
  totalFiles: number
  totalRecords: number
  totalWaypoints: number
  totalVorDme: number
  totalNdb: number
  totalAirways: number
  totalUnknown: number
  scanTimeMs: number
}

export interface CountryInventory {
  filename: string
  countryCode: string
  totalRecords: number
  waypointCount: number
  vorDmeCount: number
  ndbCount: number
  airwayCount: number
  unknownCount: number
  customerCode: string
}

interface DiscoveryResponse {
  summary: Summary
  countries: CountryInventory[]
}

export default function HomePage() {
  const [data, setData] = useState<DiscoveryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/discover")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-sans">
            ARINC 424 Data API
          </h1>
          <p className="mt-2 text-muted-foreground">
            Phase 1 -- Data Discovery and Inventory
          </p>
        </header>

        {loading && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
            <p className="text-muted-foreground">
              Scanning data files... this reads all 170 country files.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
            <p className="font-medium text-destructive">Discovery failed</p>
            <p className="mt-1 text-sm text-destructive/80">{error}</p>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-8">
            <DiscoverySummary summary={data.summary} />
            <DiscoveryTable countries={data.countries} />
          </div>
        )}
      </div>
    </main>
  )
}
