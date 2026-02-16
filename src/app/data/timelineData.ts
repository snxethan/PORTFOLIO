interface TimelineItem {
  type: "experience" | "education"
  institution: string
  location: string
  startDate: string
  endDate: string | "Present"
  highlights: string[]
  summary: string
  isCSRelated: boolean
  tags?: string[]
}

export const timelineData: TimelineItem[] = [
  {
    type: "experience",
    institution: "TrueMark",
    location: "Remote",
    startDate: "2026-01",
    endDate: "Present",
    highlights: [
      "Backend Software Developer – Engineered scalable backend solutions for enterprise customers.",
      "AWS Cloud Transformation – Led modernization efforts migrating legacy systems to AWS cloud infrastructure.",
      "AI Agent Development – Designed and implemented AWS AI agents for automated problem-solving and customer support.",
      "Code Refactoring – Performed comprehensive manual refactoring to improve code quality, maintainability, and performance.",
      "Agile Collaboration – Participated in daily standups, sprint planning, and cross-functional team coordination."
    ],
    summary:
      "Backend software developer focused on AWS cloud transformation and modernization. Worked extensively with existing customer codebases, implementing AWS services and AI agents while conducting manual refactoring to enhance system architecture and performance.",
    isCSRelated: true,
    tags: ["Computer Science", "Backend Development", "AWS", "Cloud Computing", "AI"]
  },
  {
    type: "experience",
    institution: "Neumont College of Computer Science",
    location: "Salt Lake City, UT",
    startDate: "2024-04",
    endDate: "2025-08",
    highlights: [
      "USG Vice-President – Helped lead student council & affairs.",
      "Ambassador – Supported admissions tours and events.",
      "Student Coach – Tutored and helped streamline student success.",
      "Peer Tutor – Guided freshmen with academics and transition support."
    ],
    summary:
      "Held 4 concurrent student leadership and academic support roles to increase involvement, mentorship, and academic performance at NCCS.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Leadership"]
  },
  {
    type: "education",
    institution: "Neumont College of Computer Science",
    location: "Salt Lake City, UT",
    startDate: "2023-09",
    endDate: "Present",
    highlights: [
      "Bachelor of Computer Science – 4.0 GPA",
      "Capstone & Enterprise Projects – Hands-on software engineering",
      "USG Vice President & Senator – Student government leadership"
    ],
    summary:
      "Actively engaged in student government, projects, and mentoring while maintaining a perfect GPA in a rigorous computer science program.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Bachelor's Degree"]
  },
  {
    type: "education",
    institution: "Mohave Community College",
    location: "Lake Havasu City, AZ",
    startDate: "2021-08",
    endDate: "2022-11",
    highlights: ["Dual Enrollment Credits"],
    summary:
      "Earned college credits while in high school through dual enrollment, accelerating progress in computer science education.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Dual Enrollment"]
  },
  {
    type: "education",
    institution: "Lake Havasu High School",
    location: "Lake Havasu City, AZ",
    startDate: "2019-08",
    endDate: "2023-05",
    highlights: [
      "Computer Science CTE Program – Completed 4 years of specialized computer science career and technical education.",
      "IT Certifications – Earned industry-recognized information technology certifications through rigorous coursework.",
      "Computer Science Scholarship – Awarded academic scholarship for college based on exceptional CS performance and achievements."
    ],
    summary:
      "Completed comprehensive computer science CTE program throughout high school, earning IT certifications and a computer science scholarship for college. Built strong foundation in programming, networking, and technical problem-solving.",
    isCSRelated: true,
    tags: ["Computer Science", "High School", "CTE", "Certifications"]
  }
]
