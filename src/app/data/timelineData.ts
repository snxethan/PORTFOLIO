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
    startDate: "January 2026",
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
    startDate: "April 2024",
    endDate: "September 2025",
    highlights: [
      "USG Vice-President – Led student government initiatives and campus-wide policy decisions affecting 500+ students.",
      "Campus Ambassador – Represented the college in recruitment events and guided prospective students through the admissions process.",
      "Student Success Coach – Mentored students on academic strategies, time management, and goal-setting to improve retention rates.",
      "Peer Tutor – Provided one-on-one academic support for freshmen in computer science courses, improving student understanding and performance."
    ],
    summary:
      "Served in four concurrent student leadership and academic support roles, fostering a collaborative campus culture while mentoring peers and contributing to institutional excellence at Neumont College of Computer Science.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Leadership"]
  },
  {
    type: "education",
    institution: "Neumont College of Computer Science",
    location: "Salt Lake City, UT",
    startDate: "September 2023",
    endDate: "Present",
    highlights: [
      "Bachelor of Science in Computer Science – Maintaining 4.0 GPA",
      "Capstone & Enterprise Projects – Applied software engineering principles to real-world client projects",
      "Student Government Leadership – Served as USG Vice President and Senator, representing student interests and driving campus improvements"
    ],
    summary:
      "Pursuing Bachelor of Science in Computer Science with perfect academic standing while actively contributing to campus leadership and hands-on software development projects.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Bachelor's Degree"]
  },
  {
    type: "education",
    institution: "Mohave Community College",
    location: "Lake Havasu City, AZ",
    startDate: "August 2021",
    endDate: "November 2022",
    highlights: [
      "Dual Enrollment Program – Earned college credits in computer science and mathematics while completing high school coursework"
    ],
    summary:
      "Participated in dual enrollment program, earning transferable college credits and gaining early exposure to collegiate-level computer science curriculum, which accelerated academic progression.",
    isCSRelated: true,
    tags: ["Computer Science", "College", "Dual Enrollment"]
  },
  {
    type: "education",
    institution: "Lake Havasu High School",
    location: "Lake Havasu City, AZ",
    startDate: "August 2019",
    endDate: "May 2023",
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
