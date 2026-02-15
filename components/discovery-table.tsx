"use client"

import { useState } from "react"
import type { CountryInventory } from "@/app/page"

interface TableProps {
  countries: CountryInventory[]
}

export function DiscoveryTable({ countries }: TableProps) {
  const [filter, setFilter] = useState("")

  const filtered = countries.filter(
    (c) =>
      c.countryCode.toLowerCase().includes(filter.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(filter.toLowerCase())
  )

  const noNavaidCount = countries.filter(
    (c) => c.vorDmeCount === 0 && c.ndbCount === 0
  ).length
  const noAirwayCount = countries.filter((c) => c.airwayCount === 0).length
  const hasUnknownCount = countries.filter((c) => c.unknownCount > 0).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Per-Country Inventory
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {noNavaidCount} files have no navaids, {noAirwayCount} have no
            airways, {hasUnknownCount} have unknown record types
          </p>
        </div>
        <input
          type="text"
          placeholder="Filter by country or customer code..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                Country
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                Customer
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                Total
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                Waypoints
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                VOR/DME
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                NDB
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                Airways
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                Unknown
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.countryCode}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]"
              >
                <td className="px-4 py-2 font-mono font-medium text-[var(--foreground)]">
                  {c.countryCode}
                </td>
                <td className="px-4 py-2 font-mono text-[var(--muted-foreground)]">
                  {c.customerCode}
                </td>
                <td className="px-4 py-2 text-right text-[var(--foreground)]">
                  {c.totalRecords.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-[var(--foreground)]">
                  {c.waypointCount.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-[var(--foreground)]">
                  {c.vorDmeCount > 0 ? (
                    c.vorDmeCount.toLocaleString()
                  ) : (
                    <span className="text-[var(--muted-foreground)]">--</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right text-[var(--foreground)]">
                  {c.ndbCount > 0 ? (
                    c.ndbCount.toLocaleString()
                  ) : (
                    <span className="text-[var(--muted-foreground)]">--</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right text-[var(--foreground)]">
                  {c.airwayCount > 0 ? (
                    c.airwayCount.toLocaleString()
                  ) : (
                    <span className="text-[var(--muted-foreground)]">--</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {c.unknownCount > 0 ? (
                    <span className="font-medium text-amber-500">
                      {c.unknownCount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">
        Showing {filtered.length} of {countries.length} files
      </p>
    </div>
  )
}
