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
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  // Track when component is mounted for portal
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const win2kFont: React.CSSProperties = {
    fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
    fontSize: "11px",
  }

  return (
    <div className="mb-2" style={win2kFont}>
      {/* Search Bar with Buttons */}
      <div className="relative mb-2 flex items-center gap-1">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...win2kFont,
            flex: 1,
            padding: "3px 6px",
            background: "#ffffff",
            color: "#000000",
            borderTop: "1px solid #808080",
            borderLeft: "1px solid #808080",
            borderRight: "1px solid #ffffff",
            borderBottom: "1px solid #ffffff",
            outline: "none",
          }}
        />
        
        {/* Filter & Sort Buttons */}
        <button
          onClick={() => {
            setShowTagsMenu(!showTagsMenu);
            setShowFilterMenu(false);
          }}
          className="win-btn flex items-center gap-1"
          style={{
            ...win2kFont,
            padding: "2px 6px",
            minWidth: "auto",
            background: showTagsMenu ? "#c0bdb4" : "#d4d0c8",
            borderTopColor: showTagsMenu ? "#404040" : "#ffffff",
            borderLeftColor: showTagsMenu ? "#404040" : "#ffffff",
            borderRightColor: showTagsMenu ? "#ffffff" : "#404040",
            borderBottomColor: showTagsMenu ? "#ffffff" : "#404040",
          }}
          title="Filter Options"
        >
          <FaFilter style={{ fontSize: "10px" }} />
          <span>Filter</span>
        </button>

        <button
          ref={sortButtonRef}
          onClick={() => {
            setShowFilterMenu(!showFilterMenu);
            setShowTagsMenu(false);
          }}
          className="win-btn flex items-center gap-1"
          style={{
            ...win2kFont,
            padding: "2px 6px",
            minWidth: "auto",
            background: showFilterMenu ? "#c0bdb4" : "#d4d0c8",
            borderTopColor: showFilterMenu ? "#404040" : "#ffffff",
            borderLeftColor: showFilterMenu ? "#404040" : "#ffffff",
            borderRightColor: showFilterMenu ? "#ffffff" : "#404040",
            borderBottomColor: showFilterMenu ? "#ffffff" : "#404040",
          }}
          title="Sort Options"
        >
          <FaSort style={{ fontSize: "10px" }} />
          <span>Sort{isSortActive ? " *" : ""}</span>
        </button>
      </div>

      {/* Filter Tags */}
      <div
        ref={tagsRef}
        className={`transition-all duration-200 overflow-hidden ${
          showTagsMenu ? "max-h-[400px] opacity-100 mb-2" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="flex max-h-[180px] flex-wrap content-start gap-1 overflow-y-auto p-2"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #808080",
            borderLeft: "1px solid #808080",
            borderRight: "1px solid #ffffff",
            borderBottom: "1px solid #ffffff",
          }}
        >
          {selectedTag && (
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearch("");
                onFilterInteraction?.();
              }}
              className="flex items-center justify-center"
              style={{
                ...win2kFont,
                background: "#d4d0c8",
                borderTop: "1px solid #fff",
                borderLeft: "1px solid #fff",
                borderRight: "1px solid #404040",
                borderBottom: "1px solid #404040",
                padding: "1px 4px",
                cursor: "pointer",
              }}
              title="Clear filters"
            >
              <IoMdClose style={{ fontSize: "11px" }} />
            </button>
          )}
          {sortedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(selectedTag === tag ? null : tag);
                onFilterInteraction?.();
              }}
              style={{
                ...win2kFont,
                padding: "1px 6px",
                background: selectedTag === tag ? "#000080" : "#d4d0c8",
                color: selectedTag === tag ? "#ffffff" : "#000000",
                borderTop: "1px solid #fff",
                borderLeft: "1px solid #fff",
                borderRight: "1px solid #404040",
                borderBottom: "1px solid #404040",
                cursor: "pointer",
              }}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Dropdown Portal */}
      {mounted && showFilterMenu && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] animate-[popIn_0.15s_ease-out]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            background: "#d4d0c8",
            borderTop: "1px solid #ffffff",
            borderLeft: "1px solid #ffffff",
            borderRight: "1px solid #404040",
            borderBottom: "1px solid #404040",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
            minWidth: "160px",
            padding: "2px",
            ...win2kFont,
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
              className="w-full text-left"
              style={{
                padding: "3px 8px",
                background: selectedSort === option.value ? "#000080" : "transparent",
                color: selectedSort === option.value ? "#ffffff" : "#000000",
                border: "none",
                cursor: "default",
                ...win2kFont,
              }}
              onMouseEnter={e => {
                if (selectedSort !== option.value) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#000080"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "#ffffff"
                }
              }}
              onMouseLeave={e => {
                if (selectedSort !== option.value) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "#000000"
                }
              }}
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
