import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
