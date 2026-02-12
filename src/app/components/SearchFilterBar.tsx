"use client";

import { useState, useEffect, useRef } from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

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
}: SearchFilterBarProps) {
  const sortedTags = [...tags].sort();
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showFilterMenu && sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px margin
        right: window.innerWidth - rect.right,
      });
    }
  }, [showFilterMenu]);
  
  // Determine if sort is at default value (use first option if defaultSort not provided)
  const effectiveDefaultSort = defaultSort || sortOptions[0]?.value;
  const isSortActive = selectedSort !== effectiveDefaultSort;

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg mb-6">
      {/* Search Bar with Buttons */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pr-32 bg-[#1e1e1e] border border-[#333333] rounded-lg text-white focus:border-red-600 focus:outline-none transition-all hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.01]"
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

          {/* Sort Options Button with Dropdown - Wrapped in relative container with high z-index */}
          <div className="relative z-[9999]">
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
            
            {/* Sort Dropdown Menu - Fixed positioning to escape all parent constraints */}
            {showFilterMenu && (
              <div 
                className="fixed z-[9999] bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-lg min-w-[200px] animate-[popIn_0.2s_ease-out]"
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                }}
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedSort(option.value);
                      setShowFilterMenu(false);
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tags - Animated Dropdown */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-visible ${
          showTagsMenu ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-2 overflow-visible">
          {selectedTag && (
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearch("");
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
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
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
    </div>
  );
}
