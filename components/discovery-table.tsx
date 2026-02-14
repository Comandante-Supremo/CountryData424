"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { CountryInventory } from "@/app/page"

interface TableProps {
  countries: CountryInventory[]
}

export function DiscoveryTable({ countries }: TableProps) {
  const [filter, setFilter] = useState("")

  const filtered = countries.filter((c) =>
    c.countryCode.toLowerCase().includes(filter.toLowerCase()) ||
    c.customerCode.toLowerCase().includes(filter.toLowerCase())
  )

  // Files with potential issues (no navaids, no airways, or unknown records)
  const noNavaidCount = countries.filter(
    (c) => c.vorDmeCount === 0 && c.ndbCount === 0
  ).length
  const noAirwayCount = countries.filter((c) => c.airwayCount === 0).length
  const hasUnknownCount = countries.filter((c) => c.unknownCount > 0).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Per-Country Inventory</h2>
          <p className="text-sm text-muted-foreground">
            {noNavaidCount} files have no navaids,{" "}
            {noAirwayCount} have no airways,{" "}
            {hasUnknownCount} have unknown record types
          </p>
        </div>
        <Input
          placeholder="Filter by country or customer code..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Waypoints</TableHead>
              <TableHead className="text-right">VOR/DME</TableHead>
              <TableHead className="text-right">NDB</TableHead>
              <TableHead className="text-right">Airways</TableHead>
              <TableHead className="text-right">Unknown</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.countryCode}>
                <TableCell className="font-mono font-medium">
                  {c.countryCode}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {c.customerCode}
                </TableCell>
                <TableCell className="text-right">
                  {c.totalRecords.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {c.waypointCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {c.vorDmeCount > 0 ? c.vorDmeCount.toLocaleString() : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {c.ndbCount > 0 ? c.ndbCount.toLocaleString() : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {c.airwayCount > 0 ? c.airwayCount.toLocaleString() : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {c.unknownCount > 0 ? (
                    <span className="text-amber-500 font-medium">
                      {c.unknownCount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {countries.length} files
      </p>
    </div>
  )
}
