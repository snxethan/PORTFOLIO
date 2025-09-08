import { IconType } from "react-icons"
import { BiChild, BiFirstAid, BiFork } from "react-icons/bi"
import { BsUnity, BsPatchCheckFill } from "react-icons/bs"
import { FaReact, FaNodeJs, FaPython, FaGitAlt, FaJava } from "react-icons/fa"
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

export interface Skill {
  name: string
  icon: IconType
  highlight?: boolean
  url?: string
}

export interface Certification {
  name: string
  icon: IconType
  highlight?: boolean
  url?: string
}

export const skills: Skill[] = [
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

export const unrelatedSkills: Skill[] = [
  { name: "Pediatric Care", icon: BiChild },
  { name: "Culinary Expertise", icon: BiFork, url: "/certificates/foodhandlers_certification.pdf" },
  { name: "First Aid", icon: BiFirstAid, highlight: true, url: "/certificates/firstaid_certification.pdf" },
]

export const certifications: Certification[] = [
  { name: "Cybersecurity Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/cybersecurity_certification.pdf" },
  { name: "Network Security Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/networksecurity_certification.pdf" },
  { name: "Computational Thinking Certified 2022", icon: BsPatchCheckFill, highlight: true, url: "/certificates/computationalthinking_certification.pdf" },
  { name: "Arizona Technical Skills Standard Certified 2021", icon: BsPatchCheckFill, highlight: true },
  { name: "Highschool Graduate 2023", icon: BsPatchCheckFill },
]