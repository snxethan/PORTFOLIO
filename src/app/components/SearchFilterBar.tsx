"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaFilter, FaSort } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { scrollElementIntoViewWithNavbarOffset } from "../utils/scrollWithNavbarOffset";

interface SearchFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
  tags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  sortOptions: { label: string; value: string }[];
  selectedSort: string;
  setSelectedSort: (value: string) => void;
  showTagsMenu: boolean;
  setShowTagsMenu: (show: boolean) => void;
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  defaultSort?: string; // Optional default sort value for the page
  onFilterInteraction?: () => void;
}

export default function SearchFilterBar({
  search,
  setSearch,
  placeholder,
  tags,
  selectedTag,
  setSelectedTag,
  sortOptions,
  selectedSort,
  setSelectedSort,
  showTagsMenu,
  setShowTagsMenu,
  showFilterMenu,
  setShowFilterMenu,
  defaultSort,
  onFilterInteraction,
}: SearchFilterBarProps) {
  const sortedTags = [...tags].sort();
  const FILTER_MENU_CLOSE_DURATION = 220;
  const TAG_MENU_CLOSE_DURATION = 220;
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [isFilterMenuRendered, setIsFilterMenuRendered] = useState(showFilterMenu);
  const [isFilterMenuClosing, setIsFilterMenuClosing] = useState(false);
  const [isTagsMenuRendered, setIsTagsMenuRendered] = useState(showTagsMenu);
  const [isTagsMenuClosing, setIsTagsMenuClosing] = useState(false);
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

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showFilterMenu && sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 200, // Align right edge (200px is min-width of dropdown)
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

  return (
    <div className="bg-transparent p-4 rounded-lg mb-2">
      {/* Search Bar with Buttons */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pr-32 bg-[#1e1e1e] border border-[#333333] rounded-lg text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] focus:border-red-600 focus:outline-none transition-all hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.01]"
        />
        
        {/* Filter & Sort Buttons Container */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Filter Options Button - Shows Tags */}
          <button
            onClick={() => {
              setShowTagsMenu(!showTagsMenu);
              setShowFilterMenu(false);
            }}
            className={`group p-2 rounded-lg transition-all duration-200 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 border border-transparent ${
              showTagsMenu ? "text-[#dc2626]" : "text-gray-400 hover:text-gray-300"
            }`}
            title="Filter Options"
          >
            <FaFilter className={`w-5 h-5 transition-colors ${showTagsMenu ? "text-[#dc2626]" : "group-hover:text-[#dc2626]"}`} />
          </button>

          {/* Sort Options Button - No wrapper needed */}
          <button
            ref={sortButtonRef}
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowTagsMenu(false);
            }}
            className={`group p-2 rounded-lg transition-all duration-200 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 border border-transparent focus:outline-none ${
              showFilterMenu || isSortActive ? "text-[#dc2626]" : "text-gray-400 hover:text-gray-300"
            }`}
            title="Sort Options"
          >
            <FaSort className={`w-5 h-5 transition-colors ${showFilterMenu || isSortActive ? "text-[#dc2626]" : "group-hover:text-[#dc2626]"}`} />
          </button>
        </div>
      </div>

      {/* Filter Tags - Animated Dropdown */}
      {isTagsMenuRendered && (
        <div
          ref={tagsRef}
          className={`mb-4 overflow-hidden rounded-lg border border-[#333333] bg-[#1e1e1e] shadow-lg shadow-black/20 transition-all duration-200 ease-out origin-top ${
            isTagsMenuClosing ? "animate-tag-hide pointer-events-none" : "animate-tag-extend"
          }`}
        >
          <div className="flex max-h-[220px] flex-wrap content-start gap-2 overflow-y-auto p-3 pr-1">
            {selectedTag && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSearch("");
                  onFilterInteraction?.();
                }}
                className="text-gray-400 hover:text-red-600 transition-colors hover:scale-110 transition-all duration-200 p-1"
                title="Clear filters"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            )}
            {sortedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(selectedTag === tag ? null : tag);
                  onFilterInteraction?.();
                }}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 border border-transparent ${
                  selectedTag === tag
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                    : "bg-[#3a3a3a] text-gray-300 hover:bg-[#444444] hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600 hover:text-[#dc2626]"
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Dropdown Portal - Rendered outside component hierarchy to escape z-index constraints */}
      {mounted && isFilterMenuRendered && createPortal(
        <div 
          ref={dropdownRef}
          className={`fixed z-[9999] min-w-[200px] rounded-lg border border-[#333333] bg-[#1e1e1e] shadow-lg origin-top-right ${
            isFilterMenuClosing ? "animate-sort-menu-out pointer-events-none" : "animate-sort-menu-in"
          }`}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedSort(option.value);
                setShowFilterMenu(false);
                onFilterInteraction?.();
              }}
              className={`w-full text-left px-4 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedSort === option.value
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-[#2a2a2a] hover:text-[#dc2626]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
