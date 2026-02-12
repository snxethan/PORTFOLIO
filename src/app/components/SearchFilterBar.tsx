"use client";

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
}: SearchFilterBarProps) {
  const sortedTags = [...tags].sort();

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

          {/* Sort Options Button - Shows Sort Dropdown */}
          <button
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowTagsMenu(false);
            }}
            className={`group p-2 rounded-lg transition-all duration-200 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 border border-transparent focus:outline-none ${
              showFilterMenu || selectedSort !== sortOptions[0]?.value ? "text-[#dc2626]" : "text-gray-400 hover:text-gray-300"
            }`}
            title="Sort Options"
          >
            <FaSort className={`w-5 h-5 transition-colors ${showFilterMenu || selectedSort !== sortOptions[0]?.value ? "text-[#dc2626]" : "group-hover:text-[#dc2626]"}`} />
          </button>
        </div>

        {/* Sort Dropdown Menu */}
        {showFilterMenu && (
          <div className="absolute right-0 top-full mt-2 bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-lg z-10 min-w-[200px] animate-[popIn_0.2s_ease-out]">
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
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 hover:border-red-600 hover:text-[#dc2626] border border-transparent ${
                selectedTag === tag
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                  : "bg-[#3a3a3a] text-gray-300 hover:bg-[#444444]"
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
