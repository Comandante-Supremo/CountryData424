interface SummaryProps {
  summary: {
    totalFiles: number
    totalRecords: number
    totalWaypoints: number
    totalVorDme: number
    totalNdb: number
    totalAirways: number
    totalUnknown: number
    scanTimeMs: number
  }
}

export function DiscoverySummary({ summary }: SummaryProps) {
  const stats = [
    { label: "Country Files", value: summary.totalFiles },
    { label: "Total Records", value: summary.totalRecords.toLocaleString() },
    { label: "Waypoints (EA)", value: summary.totalWaypoints.toLocaleString() },
    { label: "VOR/DME (D)", value: summary.totalVorDme.toLocaleString() },
    { label: "NDB (DB)", value: summary.totalNdb.toLocaleString() },
    { label: "Airways (ER)", value: summary.totalAirways.toLocaleString() },
    { label: "Unknown", value: summary.totalUnknown.toLocaleString() },
    { label: "Scan Time", value: `${summary.scanTimeMs}ms` },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--card-foreground)]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
