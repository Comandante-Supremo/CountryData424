// ============================================================
// Shared Constants for the ARINC 424 API
// ============================================================

/**
 * The GitHub repository that holds the ARINC 424 data files.
 * Each country is a flat .txt file at the root (e.g., CA.txt, GB.txt).
 */
export const GITHUB_REPO_OWNER = "Comandante-Supremo"
export const GITHUB_REPO_NAME = "CD424"
export const GITHUB_REPO_BRANCH = "main"

/**
 * Files in the repo that are NOT country data files.
 * These are excluded when building the country list.
 */
export const EXCLUDED_FILES = new Set(["FAACIFP18.zip"])

/**
 * Special files that need non-standard parsing (mixed customer codes, etc.)
 */
export const SPECIAL_FILES = new Set(["OCEAN.txt"])

/**
 * ARINC 424 record positions (0-indexed).
 *
 * Every record starts with:
 *   Position 0:    Record type code ("S" for standard)
 *   Position 1-3:  Customer code (3 chars, e.g. "CAN", "EUR", "SPA")
 *   Position 4:    Section code first char (e.g. "E" for enroute, "D" for navaid)
 *   Position 5:    Section code second char / subsection start
 *
 * The specific field positions vary by record type -- those are defined
 * in the parser module for each record type.
 */
export const ARINC = {
  /** Position 0: always "S" for standard records */
  RECORD_TYPE: 0,

  /** Positions 1-3: customer code (3 chars) */
  CUSTOMER_CODE_START: 1,
  CUSTOMER_CODE_END: 4,

  /** Position 4: section code (first char) */
  SECTION_CODE: 4,

  /** Position 5: section code (second char) or subsection */
  SUBSECTION_CODE: 5,
} as const
