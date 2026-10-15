import type { IconType } from "react-icons"
import {
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSortNumericDown,
  FaSortNumericDownAlt,
} from "react-icons/fa"

/**
 * A sort choice. `icon` is what the sort button shows while this option is
 * active, so the button itself says how the list is ordered.
 */
export interface SortOption {
  value: string
  label: string
  icon: IconType
}

/** Newest/oldest by date (9→1 / 1→9) and A–Z / Z–A by name. */
export const DATE_AND_NAME_SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest", icon: FaSortNumericDownAlt },
  { value: "oldest", label: "Oldest", icon: FaSortNumericDown },
  { value: "name-asc", label: "Name (A–Z)", icon: FaSortAlphaDown },
  { value: "name-desc", label: "Name (Z–A)", icon: FaSortAlphaDownAlt },
]

export const SKILL_SORT_OPTIONS: SortOption[] = [
  { value: "hard-soft", label: "Skills (Hard–Soft)", icon: FaSortAmountDown },
  { value: "soft-hard", label: "Skills (Soft–Hard)", icon: FaSortAmountUp },
  { value: "name-asc", label: "Name (A–Z)", icon: FaSortAlphaDown },
  { value: "name-desc", label: "Name (Z–A)", icon: FaSortAlphaDownAlt },
]
