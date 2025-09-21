import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaLock } from "react-icons/fa";
import TooltipWrapper from "../ToolTipWrapper";
import { useExternalLink } from "../ExternalLinkHandler";

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  source: "github" | "manual";
  ctaLabel?: string;
  ctaIcon?: "github" | "external" | "youtube" | "private" | undefined;
}

interface ProjectCardProps {
  project: Project;
}

const getCTAIcon = (icon?: string) => {
  switch (icon) {
    case "github": return <FaGithub className="w-5 h-5" />
    case "external": return <FaExternalLinkAlt className="w-5 h-5" />
    case "youtube": return <FaYoutube className="w-5 h-5" />
    case "private": return <FaLock className="w-5 h-5" />
    default: return <FaGithub className="w-5 h-5" />
  }
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { handleExternalClick } = useExternalLink();

  return (
    <div className="group bg-[#1e1e1e] hover:bg-[#252525] rounded-xl overflow-hidden border border-[#333333] hover:border-red-600/50 transition-transform duration-200 ease-out hover:scale-105 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors duration-300 mb-1">
            {project.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {project.source === "manual" && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">MANUAL</span>
            )}
            {project.source === "github" && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">GITHUB</span>
            )}
            {project.topics.includes("neumont") && (
              <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">NEU</span>
            )}
          </div>
        </div>
        <p className="text-gray-300 mb-2">{project.description}</p>
        <p className="text-sm text-gray-400 mb-1">
          Created On:{" "}
          {new Date(project.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Last Updated:{" "}
          {new Date(project.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
          {[...new Set([...project.topics, project.language].filter(Boolean).map((t) => t.toLowerCase()))].map((tag) => (
            <span key={tag} className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-[#333333] bg-[#1a1a1a]">
        <TooltipWrapper label={project.html_url} fullWidth>
          <button
            onClick={() => handleExternalClick(project.html_url, true)}
            className="flex items-center justify-center gap-2 w-full p-3 min-h-[48px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-sm sm:text-base"
            aria-label={`Open ${project.name} ${project.source === 'github' ? 'repository' : 'project'}`}
          >
            {getCTAIcon(project.ctaIcon ?? (project.source === "github" ? "github" : undefined))}
            <span className="flex-1 break-words text-center leading-tight">
              {project.name.toLowerCase() === "portfolio"
                ? "View Repository (This site!)"
                : project.ctaLabel ?? "View Repository"}
            </span>
          </button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default ProjectCard;