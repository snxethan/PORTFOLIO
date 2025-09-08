interface TimelineItem {
  type: "experience" | "education"
  institution: string
  location: string
  startDate: string
  endDate: string | "Present"
  highlights: string[]
  summary: string
}

export const timelineData: TimelineItem[] = [
  {
    type: "experience",
    institution: "Neumont College of Computer Science",
    location: "Salt Lake City, UT",
    startDate: "2024-04",
    endDate: "Present",
    highlights: [
      "USG Vice-President – Helped lead student council & affairs.",
      "Student Ambassador – Supported admissions tours and events.",
      "Student Coach – Tutored and helped streamline student success.",
      "Peer Tutor – Guided freshmen with academics and transition support."
    ],
    summary:
      "Held 4 concurrent student leadership and academic support roles to increase involvement, mentorship, and academic performance at NCCS."
  },
  {
    type: "experience",
    institution: "Romano's Chicago Pizzeria",
    location: "Lake Havasu City, AZ",
    startDate: "2021-09",
    endDate: "2023-09",
    highlights: [
      "Pizza Cook – Promoted from dishwasher to cook in fast-paced kitchen.",
      "Dishwasher – Developed efficiency and teamwork under pressure."
    ],
    summary:
      "Gained high-intensity culinary experience and built strong work ethic while assisting the head chef during peak hours."
  },
  {
    type: "experience",
    institution: "Parks & Rec",
    location: "Lake Havasu City, AZ",
    startDate: "2023-06",
    endDate: "2023-08",
    highlights: [
      "Room Lead – Supervised daily activities and group coordination.",
      "Recreational Staff – Applied pediatric and safety skills with children."
    ],
    summary:
      "Provided supervision and leadership to groups of children in a summer program, utilizing first aid and recreation management."
  },
  {
    type: "experience",
    institution: "Jack in the Box",
    location: "Lake Havasu City, AZ",
    startDate: "2020-06",
    endDate: "2021-06",
    highlights: [
      "Fry-Cook – Prepared high-volume food orders maintaining health standards.",
      "Cashier – Handled customer service, transactions, and teamwork under pressure."
    ],
    summary:
      "First job experience that sparked interest in culinary work and customer satisfaction."
  },
  {
    type: "education",
    institution: "Neumont College of Computer Science",
    location: "Salt Lake City, UT",
    startDate: "2023-09",
    endDate: "Present",
    highlights: [
      "Bachelor of Computer Science – 3.9 GPA",
      "Capstone & Enterprise Projects – Hands-on software engineering",
      "USG Vice President & Senator – Student government leadership"
    ],
    summary:
      "Actively engaged in student government, projects, and mentoring while maintaining a perfect GPA in a rigorous computer science program."
  },
  {
    type: "education",
    institution: "Lake Havasu High School",
    location: "Lake Havasu City, AZ",
    startDate: "2019-08",
    endDate: "2023-05",
    highlights: ["High School Diploma"],
    summary:
      "Graduated with academic distinction while participating in dual enrollment and career elective programs."
  },
  {
    type: "education",
    institution: "Mohave Community College",
    location: "Lake Havasu City, AZ",
    startDate: "2021-08",
    endDate: "2022-11",
    highlights: ["Dual Enrollment Credits"],
    summary:
      "Earned college credits while in high school through dual enrollment, accelerating progress in computer science education."
  },
  {
    type: "education",
    institution: "WAVE (Western Arizona Vocational Education)",
    location: "Lake Havasu City, AZ",
    startDate: "2020-08",
    endDate: "2021-05",
    highlights: ["Culinary Elective Program"],
    summary:
      "Developed culinary skills through hands-on training in a vocational setting, combining creativity and technical food preparation techniques."
  }
]