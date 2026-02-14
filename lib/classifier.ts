// ============================================================
// ARINC 424 Record Classifier
// ============================================================
// Reads a single fixed-width line and classifies it by
// section/subsection codes. This is used by both the
// discovery endpoint and the future parser.
// ============================================================

import { ARINC } from "./constants"

export type Classification =
  | "EA_WAYPOINT"
  | "ER_AIRWAY"
  | "D_VOR_DME"
  | "DB_NDB"
  | "TOO_SHORT"
  | "NON_STANDARD"
  | "UNKNOWN"

export interface ClassifiedRecord {
  classification: Classification
  customerCode: string
  sectionCode: string
  subsectionCode: string
}

/**
 * Classify a single ARINC 424 record line.
 *
 * ARINC 424 fixed-width layout (0-indexed):
 *   [0]     "S" for standard record
 *   [1..3]  Customer code (3 chars, e.g. "CAN", "EUR")
 *   [4]     Section code  ("E" = Enroute, "D" = Navaid)
 *   [5]     Subsection    ("A" = Waypoint, "R" = Route, "B" = NDB, " " = VOR/DME)
 */
export function classifyRecord(line: string): ClassifiedRecord {
  if (line.length < 6) {
    return {
      classification: "TOO_SHORT",
      customerCode: "",
      sectionCode: "",
      subsectionCode: "",
    }
  }

  if (line[ARINC.RECORD_TYPE] !== "S") {
    return {
      classification: "NON_STANDARD",
      customerCode: "",
      sectionCode: line[ARINC.SECTION_CODE] ?? "",
      subsectionCode: line[ARINC.SUBSECTION_CODE] ?? "",
    }
  }

  const customerCode = line.substring(
    ARINC.CUSTOMER_CODE_START,
    ARINC.CUSTOMER_CODE_END
  )
  const section = line[ARINC.SECTION_CODE]
  const subsection = line[ARINC.SUBSECTION_CODE]

  let classification: Classification = "UNKNOWN"

  if (section === "E" && subsection === "A") classification = "EA_WAYPOINT"
  else if (section === "E" && subsection === "R") classification = "ER_AIRWAY"
  else if (section === "D" && subsection === "B") classification = "DB_NDB"
  else if (section === "D" && subsection === " ") classification = "D_VOR_DME"

  return {
    classification,
    customerCode,
    sectionCode: section,
    subsectionCode: subsection,
  }
}
