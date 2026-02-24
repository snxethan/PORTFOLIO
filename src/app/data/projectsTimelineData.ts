import { TimelineItem } from "../components/Timeline"

export const projectsTimelineData: TimelineItem[] = [
  {
    type: "project",
    name: "Portfoli-YOU",
    startDate: "July 2025",
    endDate: "Present",
    highlights: [
      "Modular portfolio creation tool built with modern web technologies",
      "Desktop application built with Electron for cross-platform compatibility",
      "Component-based architecture for flexible portfolio customization",
      "Responsive design with Tailwind CSS for optimal user experience",
    ],
    summary:
      "A collaborative project to build a modular portfolio creation platform using React, TypeScript, Tailwind CSS, and Electron. Features both a web-based download site and a cross-platform desktop application, enabling users to easily create and customize professional portfolios.",
    language: "TypeScript",
    topics: ["react", "typescript", "tailwind", "portfolio", "web-development", "electron"],
    tags: ["Computer Science", "Web Development"],
    links: [
      { url: "https://portfoliyou.snxethan.dev/", label: "Website" },
      { url: "https://github.com/snxethan/PortfoliYOU-APP", label: "App Repository" },
      { url: "https://github.com/snxethan/PortfoliYOU-WEBSITE", label: "Web Repository" }
    ]
  },
  {
    type: "project",
    name: "TrueMark Customer AWS Transform Modernization",
    startDate: "January 2026",
    endDate: "Present",
    highlights: [
      "Cloud infrastructure modernization using AWS services",
      "Migration of legacy systems to cloud-native architecture",
      "Implementation of scalable and secure cloud solutions",
    ],
    summary:
      "Enterprise project focused on transforming and modernizing TrueMark's customer infrastructure through AWS cloud services, implementing modern DevOps practices and cloud-native solutions.",
    language: "TypeScript",
    topics: ["aws", "cloud", "devops", "modernization", "infrastructure"],
    tags: ["Computer Science", "Cloud Computing", "DevOps"],
  },
]
