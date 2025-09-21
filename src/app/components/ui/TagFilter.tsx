import React from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  activeTag: string | null;
  showAllTags: boolean;
  isExtending: boolean;
  isHiding: boolean;
  onTagSelect: (tag: string) => void;
  onToggleShowAll: () => void;
  tagLimit?: number;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTag,
  activeTag,
  showAllTags,
  isExtending,
  isHiding,
  onTagSelect,
  onToggleShowAll,
  tagLimit = 8
}) => {
  const sortedTags = React.useMemo(() => {
    if (!tags.length) return [];
    const [first, ...rest] = tags;
    const sortedRest = rest.slice().sort((a, b) => a.localeCompare(b));
    return first === "ALL" ? [first, ...sortedRest] : tags.slice().sort((a, b) => a.localeCompare(b));
  }, [tags]);

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {(showAllTags ? sortedTags : sortedTags.slice(0, tagLimit)).map((tag, index) => {
        const isSelected = selectedTag === tag || (tag === "ALL" && selectedTag === null)
        const isActive = activeTag === tag
        const isAdditionalTag = index >= tagLimit
        
        // Determine animation class for additional tags
        let animationClass = ""
        if (isAdditionalTag) {
          if (isExtending) {
            animationClass = "animate-tag-extend"
          } else if (isHiding) {
            animationClass = "animate-tag-hide"
          }
        }

        return (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform ${
              isSelected
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
                : "bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105"
            } ${isActive && !isSelected ? "animate-elastic-in" : ""} ${animationClass}`}
            aria-label={`Filter by ${tag} tag`}
          >
            {tag}
          </button>
        )
      })}
      {sortedTags.length > tagLimit && (
        <button
          onClick={onToggleShowAll}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#333333] text-gray-300 hover:bg-[#444444] hover:scale-105 transition-all duration-300 flex items-center gap-1"
          aria-label={showAllTags ? "Show less tags" : "Show more tags"}
        >
          {showAllTags ? (
            <FaChevronUp className="w-4 h-4 text-red-500" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-red-500" />
          )}
        </button>
      )}
    </div>
  );
};

export default TagFilter;