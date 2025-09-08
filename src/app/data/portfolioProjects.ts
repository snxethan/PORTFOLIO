interface Project {
  id: number
  name: string
  description: string
  html_url: string
  language: string
  topics: string[]
  created_at: string
  updated_at: string
  source: "github" | "manual"
  ctaLabel?: string
  ctaIcon?: "github" | "external" | "youtube" | "private" | undefined
}

export const manualProjects: Project[] = [
  {
    id: 1,
    name: "CSC130-ARTIC_CONE",
    description: "Built and deployed a web-app based game designed around the hit game 'Gartic Phone', a one-to-one recreation.",
    html_url: "https://github.com/Neumont-VictorKeeler/Artic_Cone",
    language: "TypeScript",
    topics: ["neumont", "game-development", "typescript", "react", "tailwind", "web", "game"],
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-30T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 2,
    name: "CSC130-UNO",
    description: "Built, designed, and deployed a Java game based on the classic card game 'UNO'.",
    html_url: "https://github.com/MasterDash5/UnoProject",
    language: "Java",
    topics: ["neumont", "java", "javafx", "cli", "game"],
    created_at: "2025-01-21T00:00:00Z",
    updated_at: "2025-01-28T00:00:00Z",
    source: "github",
    ctaLabel: "This repository is private",
    ctaIcon: "private"
  },
  {
    id: 3,
    name: "CSC110-NOTEPAD",
    description: "Contributed and built a simple and inefficient notepad application using Android Studio and Java. This was my first ever project in Java.",
    html_url: "https://github.com/Tomonator1000/Notepad",
    language: "Java",
    topics: ["java", "android studio", "neumont"],
    created_at: "2023-10-15T00:00:00Z",
    updated_at: "2023-11-30T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 4,
    name: "CSC150-CASINO",
    description: "Built and designed a simple casino CLI game using Java.",
    html_url: "https://github.com/Stat3132/CasinoTeamProject",
    language: "Java",
    topics: ["neumont", "java", "cli", "game"],
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-03-04T00:00:00Z",
    source: "github",
    ctaLabel: "View Repository",
    ctaIcon: "github"
  },
  {
    id: 5,
    name: "CSC280-ROLLIO",
    description: "Built and designed a modular portfolio creation tool using React, TypeScript, and Tailwind CSS.",
    html_url: "https://github.com/Ghussy/Rollio",
    language: "TypeScript",
    topics: ["react", "typescript", "tailwind", "neumont", "portfolio", "web"],
    created_at: "2024-11-13T00:00:00Z",
    updated_at: "2024-12-04T00:00:00Z",
    source: "github",
    ctaLabel: "This repository is private",
    ctaIcon: "private"
  },
  {
    id: 6,
    name: "PRO250-KREBSINATOR2",
    description: "Krebsinator 2: Krebsment Day is a C#/.NET desktop pet and student selector, evolved from the original Krebsinator Student Selector made by Neumont Professor Krebs, expanded by adding Desktop Pet & Settings Functionality.",
    html_url: "https://github.com/romAcosta/RandomStudentSelector",
    language: "C#",
    topics: ["c#", "existing-codebase", "software-design-and-architecture", "neumont", "desktop-pet"],
    created_at: "2025-08-15T00:00:00Z",
    updated_at: "2025-09-04T00:00:00Z",
    source: "github",
    ctaLabel: "This repository is private",
    ctaIcon: "private"
  }
]
