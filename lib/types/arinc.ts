// ============================================================
// ARINC 424 Type Definitions
// ============================================================
// These types define the structured output of our parser.
// They are designed to match what the consuming application expects:
//   - Waypoints (from EA/ENRT records)
//   - Navaids  (from D and DB records)
//   - Airway edges (built from sequential ER records)
// ============================================================

// --- Waypoint (parsed from Section EA, Subsection ENRT) ---

export interface Waypoint {
  /** 5-char fix identifier, e.g. "ADLER", "08YBK" */
  identifier: string

  /** 2-char ICAO region code, e.g. "CY" (Canada), "EG" (UK) */
  icaoRegion: string

  /** Latitude in decimal degrees (positive = North) */
  lat: number

  /** Longitude in decimal degrees (positive = East) */
  lon: number
}

// --- Navaid (parsed from Section D and Section DB) ---

export type NavaidType = "VOR" | "DME" | "VOR-DME" | "NDB" | "NDB-DME" | "TACAN" | "ILS" | "UNKNOWN"

export interface Navaid {
  /** Navaid identifier, e.g. "YYZ", "IHU" */
  identifier: string

  /** 2-char ICAO region code */
  icaoRegion: string

  /** The kind of navaid: VOR, DME, NDB, etc. */
  type: NavaidType

  /** Frequency in kHz (NDB) or MHz * 100 (VOR/DME), raw from the record */
  frequency: number

  /** Latitude in decimal degrees */
  lat: number

  /** Longitude in decimal degrees */
  lon: number
}

// --- Airway Edge (built from sequential ER records) ---

export interface AirwayEdge {
  /** Airway designator, e.g. "J556", "5T9", "NCAL6" */
  airwayIdentifier: string

  /** Identifier of the "from" fix */
  fromFix: string

  /** ICAO region of the "from" fix */
  fromIcaoRegion: string

  /** Identifier of the "to" fix */
  toFix: string

  /** ICAO region of the "to" fix */
  toIcaoRegion: string

  /** Distance between fixes in nautical miles (from the record, may be 0 if not provided) */
  distanceNm: number

  /** Minimum altitude in feet (e.g. 18000) */
  minimumAltitude: number

  /** Maximum altitude in feet (e.g. 60000) */
  maximumAltitude: number
}

// --- Country Data (the full parsed output for one country file) ---

export interface CountryData {
  /** ISO-style country code derived from the filename, e.g. "CA", "GB" */
  countryCode: string

  /** The ARINC customer code prefix found in the file, e.g. "SCAN", "SEUR" */
  customerCode: string

  /** Parsed waypoints */
  waypoints: Waypoint[]

  /** Parsed navaids (VOR, DME, NDB, etc.) */
  navaids: Navaid[]

  /** Pre-built airway edges (from → to pairs) */
  airwayEdges: AirwayEdge[]

  /** When this data was parsed / fetched */
  fetchedAt: string
}

// --- Record Classification (used internally by the parser) ---

export type RecordType = "WAYPOINT" | "VOR" | "DME" | "NDB" | "AIRWAY" | "UNKNOWN"

export interface RawRecord {
  /** The full original line from the file */
  raw: string

  /** Classified record type */
  recordType: RecordType

  /** The 1-char record type code: S = standard */
  recordTypeCode: string

  /** 3-char customer code, e.g. "CAN", "EUR", "SPA" */
  customerCode: string

  /** Section code, e.g. "EA", "D ", "DB", "ER" */
  sectionCode: string

  /** Subsection code where applicable, e.g. "ENRT" */
  subsectionCode: string
}

// --- File Inventory (output of the discovery script) ---

export interface FileInventory {
  /** Filename, e.g. "CA.txt" */
  filename: string

  /** Country code derived from filename */
  countryCode: string

  /** Total number of lines/records in the file */
  totalRecords: number

  /** Count of EA/ENRT (waypoint) records */
  waypointCount: number

  /** Count of D-section (VOR/DME) records */
  vorDmeCount: number

  /** Count of DB-section (NDB) records */
  ndbCount: number

  /** Count of ER (airway) records */
  airwayCount: number

  /** Count of records that didn't match any known pattern */
  unknownCount: number

  /** The customer code prefix found, e.g. "SCAN", "SEUR" */
  customerCode: string
}
