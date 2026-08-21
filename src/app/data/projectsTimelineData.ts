import { TimelineItem } from "../components/Timeline"

export const projectsTimelineData: TimelineItem[] = [
  {
    type: "project",
    name: "High Focus Email Scorer",
    startDate: "July 2026",
    endDate: "Present",
    highlights: [
      "Agentic email-scoring service that classifies a draft sentence-by-sentence and returns an AI-rewritten version",
      "Python/FastAPI service on AWS Lambda behind an API Gateway HTTP API, serving the UI and the API from a single origin",
      "Model-agnostic classifier with swappable provider adapters, validated against a hand-authored corpus at 98% sentence accuracy",
      "Layered prompt-injection and input guarding in front of every paid model call",
      "Infrastructure as code with Terraform and an OIDC-authenticated GitHub Actions deploy pipeline",
    ],
    summary:
      "A custom agentic email-scorer built at Soar.com for a customer client and deployed for the public. Paste an email draft and it is scored sentence-by-sentence against the High FOCUS messaging framework, then rewritten by the model with an explanation of what changed. Built as a Python/FastAPI Lambda with least-privilege IAM, cost-aware model routing, and a parity test suite guarding the scoring formula across implementations.",
    language: "Python",
    topics: ["python", "fastapi", "aws", "lambda", "terraform", "agentic-ai", "llm", "soar"],
    tags: ["Computer Science", "Artificial Intelligence", "Cloud Computing", "Backend"],
    links: [
      { url: "https://highfocus.ai", label: "Website", icon: "website" },
      { url: "https://github.com/Workplace-AI-Inc/hf-emailer-scorer", label: "Repository (Private)", icon: "github" }
    ],
  },
  {
    type: "project",
    name: "Meetings Admin Dashboard",
    startDate: "May 2026",
    endDate: "August 2026",
    highlights: [
      "Admin dashboard built with React and TypeScript for managing meetings across the PocketRN telehealth platform",
      "Designed and shipped a new endpoint exposing all user meetings to administrators, previously unavailable in a single view",
      "Search and filtering across the full meeting set, so admins can find a session without paging through records",
      "Configure, modify, and join meetings directly from the dashboard",
      "HIPAA-compliant handling of encrypted meeting and patient data, with access controls gating the admin-only surface",
    ],
    summary:
      "An administrative dashboard for PocketRN's telehealth platform, built in React and TypeScript. Backed by a new endpoint that surfaces every user meeting to administrators, the dashboard lets admins view, search, filter, configure, modify, and join meetings from one place — while keeping encrypted patient and meeting data within HIPAA-compliant access and data-handling paths.",
    language: "TypeScript",
    topics: ["react", "typescript", "healthcare", "hipaa", "dashboard", "encryption", "api", "admin"],
    tags: ["Computer Science", "Healthcare", "Web Development", "Full-stack Development"],
  },
  {
    type: "project",
    name: "Portfoli-YOU",
    startDate: "July 2025",
    endDate: "January 2026",
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
      { url: "https://portfoliyou.snxethan.dev/", label: "Website", icon: "external" },
      { url: "https://github.com/snxethan/PortfoliYOU-APP", label: "App Repository", icon: "github" },
      { url: "https://github.com/snxethan/PortfoliYOU-WEBSITE", label: "Web Repository", icon: "github" }
    ],
    images: [
      "/images/portfoliyou/portfoliyou.png",
        "/images/projects/portfoliyou/dashboard.jpg",
        "/images/projects/portfoliyou/portfolioisland.jpg",
        "/images/projects/portfoliyou/editor.jpg",
        "/images/projects/portfoliyou/exporter.jpg"
        ]
  },
  {
    type: "project",
    name: "TrueMark Customer AWS Transform Modernization",
    startDate: "January 2026",
    endDate: "March 2026",
    highlights: [
      "Cloud infrastructure modernization using AWS services",
      "Migration of legacy systems to cloud-native architecture",
      "Implementation of scalable and secure cloud solutions",
    ],
    summary:
      "Enterprise project focused on transforming and modernizing TrueMark's customer infrastructure through AWS cloud services, implementing modern DevOps practices and cloud-native solutions.",
    language: "Research & Development",
    topics: ["aws", "cloud", "devops", "modernization", "infrastructure"],
    tags: ["Computer Science", "Cloud Computing", "DevOps"],
  },
  {
    type: "project",
    name: "CloudRange Company Audit",
    startDate: "March 2026",
    endDate: "June 2026",
    highlights: [
        "Quality Assurance on production & development pipelines",
        "Testing and validating cloud-based cybersecurity solutions for reliability and performance",
        "Full-scale company wide Audit on Technical performance, practices and security of training environments and platforms",
    ],
    summary:
    "Enterprise project focused on Quality Assurance and testing CloudRangeCyber's production & developement environments, ensuring reliability and performance of cloud-based cybersecurity solutions.",
    language: "Quality Assurance",
    topics: ["cloud", "cybersecurity", "quality assurance", "testing"],
    tags: ["Computer Science", "Cybersecurity", "Quality Assurance"],
  },
]
