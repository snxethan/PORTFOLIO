export type TagMatchMode = "any" | "all"

/**
 * Multi-tag filter shared by every section.
 *
 * `hasTag` answers "does this item carry this tag?" for one tag; each section
 * supplies its own because they store tags differently (topics, language,
 * location, hard/soft skill flags...). An empty selection matches everything.
 */
export function matchesSelectedTags(
  selectedTags: string[],
  mode: TagMatchMode,
  hasTag: (tag: string) => boolean
): boolean {
  if (selectedTags.length === 0) return true
  return mode === "all" ? selectedTags.every(hasTag) : selectedTags.some(hasTag)
}

/**
 * Reads a stored tag selection. Before multi-select, sections stored a single
 * tag string (or nothing), so a returning visitor may still have that shape.
 */
export function normalizeStoredTags(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) return value.filter((tag): tag is string => typeof tag === "string")
  if (typeof value === "string") return [value]
  return fallback
}

export function toggleTag(selectedTags: string[], tag: string): string[] {
  return selectedTags.includes(tag)
    ? selectedTags.filter((selected) => selected !== tag)
    : [...selectedTags, tag]
}
