"use client"
import { FaDownload } from "react-icons/fa"

const Resume = () => {
const downloadAs = (type: string) => {
  const fileMap: Record<string, string> = {
    pdf: "/EthanTownsend_Resume.pdf",
    // csv: "/ethan_resume.csv", // make sure you have this
  }

  const fileURL = fileMap[type]

  if (!fileURL) {
    alert("Unsupported file type")
    return
  }

  const link = document.createElement("a")
  link.href = fileURL
  link.download = fileURL.split("/").pop() ?? "download"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


  return (
    <div className="bg-[#121212] text-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2">Ethan Townsend</h1>
          <p className="text-gray-400">Software Engineer | Salt Lake City, UT (84102)</p>
          <p className="text-gray-400">(928) 600-3351 | ethantownsend73@gmail.com</p>
        </header>

        {/* Download Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {/* <button
            onClick={() => downloadAs("csv")}
            className="bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaDownload /> Download as CSV
          </button> */}
          <button
            onClick={() => downloadAs("pdf")}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <FaDownload /> Download as PDF
          </button>
        </div>

        {/* Timeline Experience */}
        <div className="relative mb-16">
               <div className="flex flex-col items-center relative mb-8">
  <h2 className="text-3xl font-bold text-white z-10">Experience</h2>
  <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
</div>

          <div className="absolute left-1/2 -ml-[2px] w-[2px] bg-gray-700 h-full"></div>

          <div className="flex flex-col gap-12">
            {/* Neumont */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Neumont College of Computer Science</h3>
                <p className="text-gray-400">Salt Lake City, UT | Apr 2024 – Present</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>USG Vice-President – Helped lead student council & affairs.</li>
                  <li>Student Ambassador – Supported admissions tours and events.</li>
                  <li>Student Coach – Tutored and helped streamline student success.</li>
                  <li>Peer Tutor – Guided freshmen with academics and transition support.</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Held 4 concurrent student leadership and academic support roles to increase involvement, mentorship, and academic performance at NCCS.</p>
                </div>
              </div>
            </div>

            {/* Romano's */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Romano’s Chicago Pizzeria</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Sep 2021 – Sep 2023</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Pizza Cook – Promoted from dishwasher to cook in fast-paced kitchen.</li>
                  <li>Dishwasher – Developed efficiency and teamwork under pressure.</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Gained high-intensity culinary experience and built strong work ethic while assisting the head chef during peak hours.</p>
                </div>
              </div>
            </div>

            {/* Parks & Rec */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Parks & Rec</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Jun 2023 – Aug 2023</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Room Lead – Supervised daily activities and group coordination.</li>
                  <li>Recreational Staff – Applied pediatric and safety skills with children.</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Provided supervision and leadership to groups of children in a summer program, utilizing first aid and recreation management.</p>
                </div>
              </div>
            </div>

            {/* Jack in the Box */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Jack in the Box</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Jun 2020 – Jun 2021</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Fry-Cook – Prepared high-volume food orders maintaining health standards.</li>
                  <li>Cashier – Handled customer service, transactions, and teamwork under pressure.</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>First job experience that sparked interest in culinary work and customer satisfaction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>


               {/* Timeline Education */}
        <div className="relative mb-16">
      <div className="flex flex-col items-center relative mb-8">
  <h2 className="text-3xl font-bold text-white z-10">Education</h2>
  <span className="w-32 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
</div>

          <div className="absolute left-1/2 -ml-[2px] w-[2px] bg-gray-700 h-full"></div>

          <div className="flex flex-col gap-12">
            {/* Neumont */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Neumont College of Computer Science</h3>
                <p className="text-gray-400">Salt Lake City, UT | Sep 2023 – Present</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Bachelor of Computer Science – 3.9 GPA</li>
                  <li>Capstone & Enterprise Projects – Hands-on software engineering</li>
                  <li>USG Vice President & Senator – Student government leadership</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Actively engaged in student government, projects, and mentoring while maintaining a perfect GPA in a rigorous computer science program.</p>
                </div>
              </div>
            </div>

            {/* Lake Havasu Highschool */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Lake Havasu High School</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Aug 2019 – May 2023</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>High School Diploma</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Graduated with academic distinction while participating in dual enrollment and career elective programs.</p>
                </div>
              </div>
            </div>

            {/* Mohave Community College */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">Mohave Community College</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Aug 2021 – Nov 2022</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Dual Enrollment Credits</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Earned college credits while in high school through dual enrollment, accelerating progress in computer science education.</p>
                </div>
              </div>
            </div>

            {/* WAVE Culinary */}
            <div className="flex items-center">
              <div className="w-1/2 text-right pr-8">
                <h3 className="text-xl font-semibold">WAVE (Western Arizona Vocational Education)</h3>
                <p className="text-gray-400">Lake Havasu City, AZ | Aug 2020 – May 2021</p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                  <li>Culinary Elective Program</li>
                </ul>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300">
                  <p>Developed culinary skills through hands-on training in a vocational setting, combining creativity and technical food preparation techniques.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resume
