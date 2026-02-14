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
  }
]
