import { IconType } from "react-icons"
import { BiFork } from "react-icons/bi"
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
  SiFlutter,
  SiBlazor,
} from "react-icons/si"

export interface Skill {
  name: string
  icon: IconType
  highlight?: boolean
  url?: string
  tags?: string[]
}

export interface Certification {
  name: string
  icon: IconType
  highlight?: boolean
  url?: string
  tags?: string[]
  year: number
}

export const skills: Skill[] = [
  { name: "React", icon: FaReact, url: "https://reactjs.org/", tags: ["Computer Science", "Web Development"] },
  { name: "JavaScript", icon: SiJavascript, url: "https://www.javascript.com/", tags: ["Computer Science", "Web Development"] },
  { name: "TypeScript", icon: SiTypescript, url: "https://www.typescriptlang.org/", tags: ["Computer Science", "Web Development"] },
  { name: "Node.js", icon: FaNodeJs, highlight: true, url: "https://nodejs.org/en/", tags: ["Computer Science", "Backend"] },
  { name: "Next.js", icon: SiNextdotjs, url: "https://nextjs.org/", tags: ["Computer Science", "Web Development"] },
  { name: "Tailwind CSS", icon: SiTailwindcss, url: "https://tailwindcss.com/", tags: ["Computer Science", "Web Development"] },
  { name: "MongoDB", icon: SiMongodb, highlight: true, url: "https://www.mongodb.com/", tags: ["Computer Science", "Database"] },
  { name: "Python", icon: FaPython, url: "https://www.python.org/", tags: ["Computer Science"] },
  { name: "Git", icon: FaGitAlt, highlight: true, url: "https://git-scm.com/", tags: ["Computer Science", "DevOps"] },
  { name: "Docker", icon: SiDocker, highlight: true, url: "https://www.docker.com/", tags: ["Computer Science", "DevOps"] },
  { name: "Java", icon: FaJava, highlight: true, url: "https://www.java.com/en/", tags: ["Computer Science"] },
  { name: "C#", icon: SiDotnet, highlight: true, url: "https://dotnet.microsoft.com/en-us/languages/csharp", tags: ["Computer Science"] },
  { name: "HTML", icon: SiHtml5, url: "https://html.spec.whatwg.org/multipage/", tags: ["Computer Science", "Web Development"] },
  { name: "C++", icon: SiC, url: "https://isocpp.org/", tags: ["Computer Science"] },
  { name: "SQL", icon: SiMysql, highlight: true, url: "https://www.mysql.com/", tags: ["Computer Science", "Database"] },
  { name: "Neo4J", icon: GiSharpLips, highlight: true, url: "https://neo4j.com/", tags: ["Computer Science", "Database"] },
  { name: "Unity", icon: BsUnity, url: "https://unity.com/", tags: ["Computer Science", "Game Development"] },
  { name: "Postman", icon: SiPostman, highlight: true, url: "https://www.postman.com/", tags: ["Computer Science", "API"] },
  { name: "Flutter", icon: SiFlutter, url: "https://flutter.dev/", tags: ["Computer Science", "Mobile"] },
  { name: "Blazor", icon: SiBlazor, url: "https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor", tags: ["Computer Science", "Web Development"] },
]

export const unrelatedSkills: Skill[] = [
]

export const certifications: Certification[] = [
  { name: "Cybersecurity Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/cybersecurity_certification.pdf", tags: ["Computer Science", "Security"], year: 2023 },
  { name: "Network Security Certified 2023", icon: BsPatchCheckFill, highlight: true, url: "/certificates/networksecurity_certification.pdf", tags: ["Computer Science", "Security"], year: 2023 },
  { name: "Computational Thinking Certified 2022", icon: BsPatchCheckFill, highlight: true, url: "/certificates/computationalthinking_certification.pdf", tags: ["Computer Science"], year: 2022 },
  { name: "Arizona Technical Skills Standard Certified 2021", icon: BsPatchCheckFill, highlight: true, tags: ["Computer Science"], year: 2021 },
]
