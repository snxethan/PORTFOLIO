import { TimelineItem } from "../components/Timeline"

export const projectsTimelineData: TimelineItem[] = [
  {
    type: "project",
    name: "Portfoli-YOU",
    startDate: "2024-11",
    endDate: "2024-12",
    highlights: [
      "Modular portfolio creation tool built with modern web technologies",
      "Component-based architecture for flexible portfolio customization",
      "Responsive design with Tailwind CSS for optimal user experience",
    ],
    summary:
      "A collaborative project to build a modular portfolio creation platform using React, TypeScript, and Tailwind CSS, enabling users to easily create and customize professional portfolios.",
    language: "TypeScript",
    topics: ["react", "typescript", "tailwind", "portfolio", "web-development"],
    tags: ["Computer Science", "Web Development"],
    url: "https://github.com/Ghussy/Rollio",
  },
  {
    type: "project",
    name: "TrueMark Customer AWS Transform Modernization",
    startDate: "2025-01",
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
    url: "#",
  },
]
