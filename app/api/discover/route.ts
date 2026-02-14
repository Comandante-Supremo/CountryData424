// ============================================================
// GET /api/discover
// ============================================================
// Scans all .txt data files in the project root and returns
// a structured inventory of ARINC 424 record types per country.
//
// This endpoint serves two purposes:
//   1. Phase 1 testing -- verify we can read and classify all data
//   2. Future use -- the /api/countries endpoint will use similar
//      logic to list available countries
// ============================================================

import { NextResponse } from "next/server"
import { readdir, readFile } from "fs/promises"
import { join } from "path"
import { classifyRecord } from "@/lib/classifier"
import { EXCLUDED_FILES } from "@/lib/constants"
import type { FileInventory } from "@/lib/types/arinc"

export const dynamic = "force-dynamic"

export async function GET() {
  const startTime = Date.now()

  try {
    // The data files live at the project root alongside the app directory
    const dataDir = process.cwd()

    const entries = await readdir(dataDir)
    const txtFiles = entries
      .filter((f) => f.endsWith(".txt") && !EXCLUDED_FILES.has(f))
      .sort()

    const inventory: FileInventory[] = []

    let globalWaypoints = 0
    let globalVorDme = 0
    let globalNdb = 0
    let globalAirways = 0
    let globalUnknown = 0
    let globalTotal = 0

    for (const filename of txtFiles) {
      const filepath = join(dataDir, filename)
      const content = await readFile(filepath, "utf-8")
      const lines = content.split("\n").filter((l) => l.trim().length > 0)

      let waypointCount = 0
      let vorDmeCount = 0
      let ndbCount = 0
      let airwayCount = 0
      let unknownCount = 0
      let customerCode = ""

      for (const line of lines) {
        const result = classifyRecord(line)

        if (!customerCode && result.customerCode) {
          customerCode = result.customerCode
        }

        switch (result.classification) {
          case "EA_WAYPOINT":
            waypointCount++
            break
          case "ER_AIRWAY":
            airwayCount++
            break
          case "D_VOR_DME":
            vorDmeCount++
            break
          case "DB_NDB":
            ndbCount++
            break
          default:
            unknownCount++
            break
        }
      }

      const countryCode = filename.replace(".txt", "")

      inventory.push({
        filename,
        countryCode,
        totalRecords: lines.length,
        waypointCount,
        vorDmeCount,
        ndbCount,
        airwayCount,
        unknownCount,
        customerCode,
      })

      globalWaypoints += waypointCount
      globalVorDme += vorDmeCount
      globalNdb += ndbCount
      globalAirways += airwayCount
      globalUnknown += unknownCount
      globalTotal += lines.length
    }

    const elapsed = Date.now() - startTime

    return NextResponse.json({
      summary: {
        totalFiles: inventory.length,
        totalRecords: globalTotal,
        totalWaypoints: globalWaypoints,
        totalVorDme: globalVorDme,
        totalNdb: globalNdb,
        totalAirways: globalAirways,
        totalUnknown: globalUnknown,
        scanTimeMs: elapsed,
      },
      countries: inventory,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Discovery scan failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
