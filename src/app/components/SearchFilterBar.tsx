"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaFilter, FaSort, FaExchangeAlt } from "react-icons/fa";
import { MdGridView, MdViewCarousel } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { scrollElementIntoViewWithNavbarOffset } from "../utils/scrollWithNavbarOffset";
import type { SortOption } from "../utils/sortOptions";
import { toggleTag, type TagMatchMode } from "../utils/tagFilter";
import type { ViewMode } from "../hooks/useSectionView";

interface SearchFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  tagMatchMode: TagMatchMode;
  setTagMatchMode: (mode: TagMatchMode) => void;
  sortOptions: SortOption[];
  selectedSort: string;
  setSelectedSort: (value: string) => void;
  showTagsMenu: boolean;
  setShowTagsMenu: (show: boolean) => void;
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  defaultSort?: string; // Optional default sort value for the page
  onFilterInteraction?: () => void;
  /** Grid vs. horizontal rail. Omit both view props to hide the toggle. */
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  /** Rail auto-scroll. Omit both props to hide the toggle. */
  autoScroll?: boolean;
  onAutoScrollChange?: (enabled: boolean) => void;
}

// Icon buttons inside the search field. They change colour on hover but never
// size or position, so the target stays exactly where the pointer is.
const iconButtonClass =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors duration-200 hover:border-red-600/60 hover:bg-[#2a2a2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-transparent disabled:hover:bg-transparent";

const iconButtonStateClass = (isActive: boolean) =>
  isActive ? "text-[#dc2626]" : "text-gray-400 hover:text-[#dc2626]";

export default function SearchFilterBar({
  search,
  setSearch,
  placeholder,
  tags,
  selectedTags,
  setSelectedTags,
  tagMatchMode,
  setTagMatchMode,
  sortOptions,
  selectedSort,
  setSelectedSort,
  showTagsMenu,
  setShowTagsMenu,
  showFilterMenu,
  setShowFilterMenu,
  defaultSort,
  onFilterInteraction,
  viewMode,
  onViewModeChange,
  autoScroll,
  onAutoScrollChange,
}: SearchFilterBarProps) {
  const sortedTags = [...tags].sort();
  const FILTER_MENU_CLOSE_DURATION = 220;
  const TAG_MENU_CLOSE_DURATION = 260; // matches .collapse-panel transition
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [isFilterMenuRendered, setIsFilterMenuRendered] = useState(showFilterMenu);
  const [isFilterMenuClosing, setIsFilterMenuClosing] = useState(false);
  const [isTagsMenuRendered, setIsTagsMenuRendered] = useState(showTagsMenu);
  const [isTagsMenuClosing, setIsTagsMenuClosing] = useState(false);
  // The panel mounts collapsed and expands one frame later, so the browser
  // has a collapsed state to transition from.
  const [isTagsPanelExpanded, setIsTagsPanelExpanded] = useState(false);
  const filterMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tagsMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track when component is mounted for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (filterMenuTimeoutRef.current) {
      clearTimeout(filterMenuTimeoutRef.current);
      filterMenuTimeoutRef.current = null;
    }

    if (showFilterMenu) {
      setIsFilterMenuRendered(true);
      setIsFilterMenuClosing(false);
      return;
    }

    if (isFilterMenuRendered) {
      setIsFilterMenuClosing(true);
      filterMenuTimeoutRef.current = setTimeout(() => {
        setIsFilterMenuRendered(false);
        setIsFilterMenuClosing(false);
        filterMenuTimeoutRef.current = null;
      }, FILTER_MENU_CLOSE_DURATION);
    }

    return () => {
      if (filterMenuTimeoutRef.current) {
        clearTimeout(filterMenuTimeoutRef.current);
        filterMenuTimeoutRef.current = null;
      }
    };
  }, [showFilterMenu, isFilterMenuRendered]);

  useEffect(() => {
    if (tagsMenuTimeoutRef.current) {
      clearTimeout(tagsMenuTimeoutRef.current);
      tagsMenuTimeoutRef.current = null;
    }

    if (showTagsMenu) {
      setIsTagsMenuRendered(true);
      setIsTagsMenuClosing(false);
      return;
    }

    if (isTagsMenuRendered) {
      setIsTagsMenuClosing(true);
      tagsMenuTimeoutRef.current = setTimeout(() => {
        setIsTagsMenuRendered(false);
        setIsTagsMenuClosing(false);
        tagsMenuTimeoutRef.current = null;
      }, TAG_MENU_CLOSE_DURATION);
    }

    return () => {
      if (tagsMenuTimeoutRef.current) {
        clearTimeout(tagsMenuTimeoutRef.current);
        tagsMenuTimeoutRef.current = null;
      }
    };
  }, [showTagsMenu, isTagsMenuRendered]);

  useEffect(() => {
    if (!isTagsMenuRendered || isTagsMenuClosing) {
      setIsTagsPanelExpanded(false);
      return;
    }
    const frame = requestAnimationFrame(() => setIsTagsPanelExpanded(true));
    return () => cancelAnimationFrame(frame);
  }, [isTagsMenuRendered, isTagsMenuClosing]);

  // Auto-scroll to tags section when it opens
  useEffect(() => {
    if (showTagsMenu && tagsRef.current) {
      // Wait for the expand animation to begin before scrolling
      const id = setTimeout(() => {
        scrollElementIntoViewWithNavbarOffset(tagsRef.current, 10);
      }, 50);
      return () => clearTimeout(id);
    }
  }, [showTagsMenu]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (showFilterMenu) {
        setShowFilterMenu(false);
      }

      if (showTagsMenu) {
        setShowTagsMenu(false);
      }
    };

    if (showFilterMenu || showTagsMenu) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showFilterMenu, showTagsMenu, setShowFilterMenu, setShowTagsMenu]);

  // Determine if sort is at default value (use first option if defaultSort not provided)
  const effectiveDefaultSort = defaultSort || sortOptions[0]?.value;
  const isSortActive = mounted && selectedSort !== effectiveDefaultSort;
  const activeSortOption = sortOptions.find((option) => option.value === selectedSort);
  const SortIcon = activeSortOption?.icon ?? FaSort;
  const hasSelectedTags = selectedTags.length > 0;

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showFilterMenu && sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - 200), // Align right edge (200px is min-width of dropdown)
      });
    }
  }, [showFilterMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilterMenu &&
        dropdownRef.current &&
        sortButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    };

    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterMenu, setShowFilterMenu]);

  // Narrowing the cards with filters stops auto-scroll, so the results stay
  // put while the visitor reads them. They can turn it back on.
  const changeTags = (next: string[]) => {
    setSelectedTags(next);
    if (autoScroll) onAutoScrollChange?.(false);
  };

  const hasViewToggle = viewMode !== undefined && onViewModeChange !== undefined;
  const hasAutoScrollToggle = autoScroll !== undefined && onAutoScrollChange !== undefined;
  const isGrid = viewMode === "grid";
  const isAutoScrollOn = Boolean(autoScroll) && !isGrid;

  return (
    <div className="bg-transparent p-4 rounded-lg mb-2">
      {/* Search Bar with Buttons */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={placeholder}
          aria-label={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-4 ${hasViewToggle || hasAutoScrollToggle ? "pr-44" : "pr-24"} bg-[#1e1e1e] border border-[#333333] rounded-lg text-white text-ellipsis shadow-[0_10px_24px_rgba(0,0,0,0.24)] focus:border-red-600 focus:outline-none transition-colors hover:border-red-600/70`}
        />

        {/* Filter & sort on the left, layout controls on the right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {/* Filter Options Button - Shows Tags */}
          <button
            type="button"
            onClick={() => {
              setShowTagsMenu(!showTagsMenu);
              setShowFilterMenu(false);
            }}
            aria-expanded={showTagsMenu}
            className={`${iconButtonClass} ${iconButtonStateClass(showTagsMenu || hasSelectedTags)}`}
            title={hasSelectedTags ? `Filter (${selectedTags.length} selected)` : "Filter by tags"}
          >
            <FaFilter className="h-4 w-4" />
            {hasSelectedTags && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                {selectedTags.length}
              </span>
            )}
          </button>

          {/* Sort Options Button - icon mirrors the active sort */}
          <button
            type="button"
            ref={sortButtonRef}
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowTagsMenu(false);
            }}
            aria-expanded={showFilterMenu}
            className={`${iconButtonClass} ${iconButtonStateClass(showFilterMenu || isSortActive)}`}
            title={activeSortOption ? `Sort: ${activeSortOption.label}` : "Sort options"}
          >
            <SortIcon className="h-[18px] w-[18px]" />
          </button>

          {(hasViewToggle || hasAutoScrollToggle) && (
            <span className="mx-1 h-5 w-px bg-[#333333]" aria-hidden="true" />
          )}

          {/* The icon shows the view you would switch to. */}
          {hasViewToggle && (
            <button
              type="button"
              onClick={() => onViewModeChange?.(isGrid ? "rail" : "grid")}
              className={`${iconButtonClass} ${iconButtonStateClass(false)}`}
              title={isGrid ? "Switch to scroll view" : "Switch to grid view"}
              aria-label={isGrid ? "Switch to scroll view" : "Switch to grid view"}
            >
              {isGrid ? <MdViewCarousel className="h-5 w-5" /> : <MdGridView className="h-5 w-5" />}
            </button>
          )}

          {/* Auto-scroll only exists in scroll view. */}
          {hasAutoScrollToggle && !isGrid && (
            <button
              type="button"
              onClick={() => onAutoScrollChange?.(!autoScroll)}
              aria-pressed={isAutoScrollOn}
              className={`${iconButtonClass} ${iconButtonStateClass(isAutoScrollOn)}`}
              title={autoScroll ? "Auto-scroll on (click to stop)" : "Auto-scroll off (click to start)"}
            >
              <FaExchangeAlt className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tags - Animated Dropdown */}
      {isTagsMenuRendered && (
        <div
          ref={tagsRef}
          data-open={isTagsPanelExpanded}
          className={`collapse-panel mb-4 ${isTagsMenuClosing ? "pointer-events-none" : ""}`}
        >
        <div className="rounded-lg border border-[#333333] bg-[#1e1e1e] shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border-b border-[#333333] px-3 py-2">
            <span className="text-xs text-gray-400">Match</span>
            <button
              type="button"
              onClick={() => {
                setTagMatchMode(tagMatchMode === "any" ? "all" : "any");
                if (autoScroll) onAutoScrollChange?.(false);
                onFilterInteraction?.();
              }}
              className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-200 transition-colors hover:border-red-600 hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              title={
                tagMatchMode === "any"
                  ? "Showing items with ANY selected tag (click to require ALL)"
                  : "Showing items with ALL selected tags (click to allow ANY)"
              }
            >
              {tagMatchMode === "any" ? "ANY" : "ALL"}
            </button>
            <span className="truncate text-xs text-gray-500">
              {hasSelectedTags ? `${selectedTags.length} selected` : "No tags selected"}
            </span>
            {hasSelectedTags && (
              <button
                type="button"
                onClick={() => {
                  changeTags([]);
                  setSearch("");
                  onFilterInteraction?.();
                }}
                className="ml-auto rounded-md p-1 text-gray-400 transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                title="Clear filters"
                aria-label="Clear filters"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex max-h-[220px] flex-wrap content-start gap-2 overflow-y-auto p-3 pr-1">
            {sortedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => {
                    changeTags(toggleTag(selectedTags, tag));
                    onFilterInteraction?.();
                  }}
                  aria-pressed={isSelected}
                  className={`px-3 py-1 rounded-full text-sm transition-[scale,transform,color,background-color,border-color] duration-200 hover:scale-105 border ${
                    isSelected
                      ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/40"
                      : "bg-[#3a3a3a] text-gray-300 border-transparent hover:bg-[#444444] hover:border-red-600 hover:text-[#dc2626]"
                  }`}
                >
                  {tag.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
        </div>
      )}

      {/* Sort Dropdown Portal - Rendered outside component hierarchy to escape z-index constraints */}
      {mounted && isFilterMenuRendered && createPortal(
        <div
          ref={dropdownRef}
          className={`fixed z-[9999] min-w-[200px] rounded-lg border border-[#333333] bg-[#1e1e1e] shadow-lg ${
            isFilterMenuClosing ? "animate-menu-out pointer-events-none" : "animate-menu-in"
          }`}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {sortOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  setSelectedSort(option.value);
                  setShowFilterMenu(false);
                  onFilterInteraction?.();
                }}
                className={`flex w-full items-center gap-3 text-left px-4 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedSort === option.value
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-[#dc2626]"
                }`}
              >
                <OptionIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
