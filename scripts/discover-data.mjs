// ============================================================
// Data Discovery Script
// ============================================================
// Scans all .txt files in the repository root and reports:
//   - Which record types each file contains
//   - Record counts per type
//   - Customer code prefixes
//   - Total inventory summary
//
// Run with: node scripts/discover-data.mjs
// ============================================================

import { readdir, readFile } from "fs/promises"
import { join } from "path"

const DATA_DIR = process.cwd()

// Files to skip
const EXCLUDED = new Set(["FAACIFP18.zip"])

/**
 * Classify a single ARINC 424 record line.
 * Returns the record type based on section/subsection codes.
 */
function classifyRecord(line) {
  if (line.length < 6) return "TOO_SHORT"
  if (line[0] !== "S") return "NON_STANDARD"

  const customerCode = line.substring(1, 4)
  const sectionChar = line[4]
  const subsectionChar = line[5]

  // EA + ENRT = Enroute Waypoint
  if (sectionChar === "E" && subsectionChar === "A") return "EA_WAYPOINT"

  // ER = Enroute Route (Airway)
  if (sectionChar === "E" && subsectionChar === "R") return "ER_AIRWAY"

  // DB = NDB Navaid
  if (sectionChar === "D" && subsectionChar === "B") return "DB_NDB"

  // D + space = VOR/DME Navaid
  if (sectionChar === "D" && subsectionChar === " ") return "D_VOR_DME"

  // Anything else
  return `OTHER_${sectionChar}${subsectionChar}`
}

/**
 * Extract the 3-char customer code from a record line.
 */
function getCustomerCode(line) {
  if (line.length < 4) return "???"
  return line.substring(1, 4)
}

async function main() {
  console.log("=== ARINC 424 Data Discovery ===\n")

  // Find all .txt files in the repo root
  const entries = await readdir(DATA_DIR)
  const txtFiles = entries
    .filter((f) => f.endsWith(".txt") && !EXCLUDED.has(f))
    .sort()

  console.log(`Found ${txtFiles.length} data files\n`)

  // Track global totals
  let globalTotals = {
    files: 0,
    totalRecords: 0,
    EA_WAYPOINT: 0,
    ER_AIRWAY: 0,
    DB_NDB: 0,
    D_VOR_DME: 0,
    other: 0,
  }

  // Store per-file results for the summary table
  const results = []

  for (const filename of txtFiles) {
    const filepath = join(DATA_DIR, filename)
    const content = await readFile(filepath, "utf-8")
    const lines = content.split("\n").filter((l) => l.trim().length > 0)

    const counts = {}
    let customerCode = ""

    for (const line of lines) {
      const type = classifyRecord(line)
      counts[type] = (counts[type] || 0) + 1

      // Grab the customer code from the first valid record
      if (!customerCode && line[0] === "S") {
        customerCode = getCustomerCode(line)
      }
    }

    const countryCode = filename.replace(".txt", "")
    const waypointCount = counts["EA_WAYPOINT"] || 0
    const airwayCount = counts["ER_AIRWAY"] || 0
    const ndbCount = counts["DB_NDB"] || 0
    const vorDmeCount = counts["D_VOR_DME"] || 0
    const otherCount = lines.length - waypointCount - airwayCount - ndbCount - vorDmeCount

    results.push({
      countryCode,
      customerCode,
      totalRecords: lines.length,
      waypointCount,
      vorDmeCount,
      ndbCount,
      airwayCount,
      otherCount,
    })

    globalTotals.files++
    globalTotals.totalRecords += lines.length
    globalTotals.EA_WAYPOINT += waypointCount
    globalTotals.ER_AIRWAY += airwayCount
    globalTotals.DB_NDB += ndbCount
    globalTotals.D_VOR_DME += vorDmeCount
    globalTotals.other += otherCount
  }

  // Print the summary table
  console.log(
    "Country | Customer | Total | Waypoints | VOR/DME | NDB | Airways | Other"
  )
  console.log(
    "--------|----------|-------|-----------|---------|-----|---------|------"
  )

  for (const r of results) {
    console.log(
      `${r.countryCode.padEnd(7)} | ${r.customerCode.padEnd(8)} | ${String(r.totalRecords).padStart(5)} | ${String(r.waypointCount).padStart(9)} | ${String(r.vorDmeCount).padStart(7)} | ${String(r.ndbCount).padStart(3)} | ${String(r.airwayCount).padStart(7)} | ${String(r.otherCount).padStart(5)}`
    )
  }

  // Print global totals
  console.log("\n=== Global Totals ===")
  console.log(`Files:      ${globalTotals.files}`)
  console.log(`Records:    ${globalTotals.totalRecords}`)
  console.log(`Waypoints:  ${globalTotals.EA_WAYPOINT}`)
  console.log(`VOR/DME:    ${globalTotals.D_VOR_DME}`)
  console.log(`NDB:        ${globalTotals.DB_NDB}`)
  console.log(`Airways:    ${globalTotals.ER_AIRWAY}`)
  console.log(`Other:      ${globalTotals.other}`)

  // Print unique customer codes
  const uniqueCustomerCodes = [...new Set(results.map((r) => r.customerCode))].sort()
  console.log(`\nUnique customer codes (${uniqueCustomerCodes.length}): ${uniqueCustomerCodes.join(", ")}`)

  // Flag files with no airways or no navaids
  const noAirways = results.filter((r) => r.airwayCount === 0)
  const noNavaids = results.filter((r) => r.vorDmeCount === 0 && r.ndbCount === 0)

  if (noAirways.length > 0) {
    console.log(`\nFiles with NO airway records (${noAirways.length}): ${noAirways.map((r) => r.countryCode).join(", ")}`)
  }

  if (noNavaids.length > 0) {
    console.log(`\nFiles with NO navaid records (${noNavaids.length}): ${noNavaids.map((r) => r.countryCode).join(", ")}`)
  }
}

main().catch(console.error)
