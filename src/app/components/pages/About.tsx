"use client"
import { useEffect, useState } from "react"
import { BiChild, BiFirstAid, BiFork } from "react-icons/bi"
import { BsUnity, BsPatchCheckFill } from "react-icons/bs"
import { FaReact, FaNodeJs, FaPython, FaGitAlt, FaJava, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa"
import { GiSharpLips } from "react-icons/gi"
import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiDocker,
  SiC,
  SiDotnet,
  SiPostman,
  SiHtml5,
  SiMysql,
} from "react-icons/si"

import { useExternalLink } from "../ExternalLinkHandler"
import TooltipWrapper from "../ToolTipWrapper"
import PDFModalViewer from "../PDFModalViewer"

const About = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const { handleExternalClick } = useExternalLink()
  const [clickedCard, setClickedCard] = useState<string | null>(null)

  useEffect(() => {
    setLoading(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPDF(null)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const skills = [
    { name: "React", icon: FaReact, highlight: true, url: "https://reactjs.org/" },
    { name: "JavaScript", icon: SiJavascript, url: "https://www.javascript.com/" },
    { name: "TypeScript", icon: SiTypescript, highlight: true, url: "https://www.typescriptlang.org/" },
    { name: "Node.js", icon: FaNodeJs, highlight: true, url: "https://nodejs.org/en/" },
    { name: "Next.js", icon: SiNextdotjs, highlight: true, url: "https://nextjs.org/" },
    { name: "Tailwind CSS", icon: SiTailwindcss, url: "https://tailwindcss.com/" },
    { name: "MongoDB", icon: SiMongodb, url: "https://www.mongodb.com/" },
    { name: "Python", icon: FaPython, url: "https://www.python.org/" },
    { name: "Git", icon: FaGitAlt, highlight: true, url: "https://git-scm.com/" },
    { name: "Docker", icon: SiDocker, highlight: true, url: "https://www.docker.com/" },
    { name: "Java", icon: FaJava, highlight: true, url: "https://www.java.com/en/" },
    { name: "C#", icon: SiDotnet, highlight: true, url: "https://dotnet.microsoft.com/en-us/languages/csharp" },
    { name: "HTML", icon: SiHtml5, url: "https://html.spec.whatwg.org/multipage/" },
    { name: "C++", icon: SiC, url: "https://isocpp.org/" },
    { name: "SQL", icon: SiMysql, highlight: true, url: "https://www.mysql.com/" },
    { name: "Neo4J", icon: GiSharpLips, highlight: true, url: "https://neo4j.com/" },
    { name: "Unity", icon: BsUnity, url: "https://unity.com/" },
    { name: "Postman", icon: SiPostman, highlight: true, url: "https://www.postman.com/" },
  ]

  const unrelatedSkills = [
    { name: "Pediatric Care", icon: BiChild },
    { name: "Culinary Expertise", icon: BiFork, url: "/certificates/foodhandlers_certification.pdf" },
    { name: "First Aid", icon: BiFirstAid, highlight: true, url: "/certificates/firstaid_certification.pdf" },
  ]

  const certifications = [
    { name: "Cybersecurity Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/cybersecurity_certification.pdf" },
    { name: "Network Security Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/networksecurity_certification.pdf" },
    { name: "Computational Thinking Certified 2022", icon: BsPatchCheckFill, highlight: true, url: "/certificates/computationalthinking_certification.pdf" },
    { name: "Arizona Technical Skills Standard Certified 2021", icon: BsPatchCheckFill, highlight: true },
    { name: "Highschool Graduate 2023", icon: BsPatchCheckFill },
  ]

  const renderSkillGrid = (items: any[]) => {
    const sortedItems = [...items].sort((a, b) => {
      if (a.highlight === b.highlight) {
        return a.name.localeCompare(b.name)
      }
      return a.highlight ? -1 : 1
    })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {sortedItems.map(({ name, icon: Icon, highlight, url }: any) => {
        const isClicked = clickedCard === name 
        const Card = (
          <div
            className={`group relative flex flex-col items-center bg-[#1e1e1e] hover:bg-[#252525] p-3 sm:p-4 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-transform duration-300 ease-out hover:scale-[1.09] active:scale-95`} 
          >
            <div // Icon container
              className={`inline-block p-1.5 sm:p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                highlight ? "bg-gradient-to-br from-red-500 to-red-700" : "bg-red-600/40 group-hover:bg-red-600/50"
              }`} 
            >
              <Icon className="text-white text-lg sm:text-xl" /> 
            </div>
            {/* Removed whitespace-nowrap to allow text to wrap */}
            <p className="text-white mt-1.5 sm:mt-2 font-semibold text-xs sm:text-sm text-center">{name}</p> 
            
            {(url?.endsWith(".pdf") || (url && !url.endsWith(".pdf"))) && (
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-gray-400 group-hover:text-red-400 transition-colors duration-300"> 
                {url?.endsWith(".pdf") && <FaFilePdf size={14} aria-label="View Certification" />} 
                {url && !url.endsWith(".pdf") && <FaExternalLinkAlt size={14} aria-label="Open external link" />} 
              </div>
            )}
          </div>
        )

        const handleClick = () => {
          setClickedCard(name)
          setTimeout(() => setClickedCard(null), 300) 
        }

        if (url?.endsWith(".pdf")) {
          return (
            <TooltipWrapper key={name} label="View Certification" url={url}>
              <div onClick={() => { setSelectedPDF(url); handleClick() }} className="cursor-pointer">
                {Card}
              </div>
            </TooltipWrapper>
          )
        }

        return url ? (
          <TooltipWrapper key={name} label={url}>
            <div onClick={() => { handleExternalClick(url, true); handleClick() }} className="cursor-pointer">
              {Card}
            </div>
          </TooltipWrapper>
        ) : (
          <div key={name} onClick={handleClick} className="cursor-pointer">
            {Card}
          </div>
        )
      })}
    </div>
  )
}

  const renderSkeletonGrid = (count: number) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-[#1e1e1e] border border-[#333333] p-3 sm:p-4 rounded-xl animate-pulse flex flex-col items-center mx-auto">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#333333] rounded mb-1.5 sm:mb-2" /> 
          <div className="h-2.5 sm:h-3 bg-[#333333] rounded w-16 sm:w-20" />
        </div>
      ))}
    </div>
  )


  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-6 relative text-center">
        Information, Certifications, and Skills.
        <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
      </h2>
      <section id="about" className="py-20 bg-[#121212] text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 gap-16">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-100">I'm Ethan Townsend, a Software Engineer passionate about creating high-quality projects across both frontend and backend development.</p>
            <p className="text-lg text-gray-400">I have experience working with a variety of technologies, including Java & C#, Node.js & React, and various cloud and databasing platforms. I am always eager to learn new things and stay up-to-date with the latest industry trends.</p>
            <p className="text-lg text-gray-400">In my free time, I enjoy contributing to open-source projects and exploring new technologies, and having fun with my friends. I believe that collaboration and sharing knowledge are key to personal and professional growth.</p>
          </div>

          <div>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Certifications</h2>
              <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
            </div>
            {loading ? renderSkeletonGrid(6) : renderSkillGrid(certifications)}
          </div>

          <div>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Skills</h2>
              <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
            </div>
            {loading ? renderSkeletonGrid(9) : renderSkillGrid(skills)}
          </div>

          <div>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Misc. Skills</h2>
              <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
            </div>
            {loading ? renderSkeletonGrid(3) : renderSkillGrid(unrelatedSkills)}
          </div>
        </div>
      </section>

      <PDFModalViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </div>
  )
}

export default About
