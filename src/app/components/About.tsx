import { BiChild, BiFirstAid, BiFork } from "react-icons/bi"
import { BsUnity } from "react-icons/bs"
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
  SiCachet,
  SiDotnet,
  SiPostman,
  SiHtml5,
  SiMysql,
} from "react-icons/si"

const About = () => {
const skills = [
  { name: "React", icon: FaReact, highlight: true },
  { name: "JavaScript", icon: SiJavascript, },
  { name: "TypeScript", icon: SiTypescript, highlight: true },
  { name: "Node.js", icon: FaNodeJs, highlight:true },
  { name: "Next.js", icon: SiNextdotjs, highlight:true },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Python", icon: FaPython },
  { name: "Git", icon: FaGitAlt, highlight:true},
  { name: "Docker", icon: SiDocker, highlight:true },
  { name: "Java", icon: FaJava, highlight:true},
  { name: "C#", icon: SiDotnet, highlight:true },
  { name: "HTML", icon: SiHtml5 },
  { name: "C++", icon: SiC, highlight:true},
  { name: "SQL", icon: SiMysql, highlight:true },
  { name: "Neo4J", icon: GiSharpLips },
  { name: "Unity", icon: BsUnity },
  { name: "Postman", icon: SiPostman, highlight:true },
  ]
  const sortedSkills = [...skills].sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0));
  const unrelatedSkills = [
    { name: "Pediatric Care", icon: BiChild },
    { name: "First Aid Certified", icon: BiFirstAid },
    { name: "Culinary Expertise", icon: BiFork },
  ]

  return (
    <div>
          <h2 className="text-4xl font-bold text-white mb-6 relative text-center">
      About Me
      <span className="absolute bottom-[-8px]  left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
    </h2>
  <section id="about" className="py-20 bg-[#121212] text-white">
    
  <div className="container mx-auto px-4">

    <div className="grid grid-cols-1 gap-8">
      {/* Intro Text */}
      <div>
        <p className="text-lg text-gray-100 mb-4 text-center">
          I'm Ethan Townsend, a Software Engineer passionate about creating high-quality projects across both frontend and backend development.
        </p>
        <p className="text-lg text-gray-400 mb-4 text-center">
          I have experience working with a variety of technologies, including Java & C#, Node.js & React, and various cloud and databasing
          platforms. I am always eager to learn new things and stay up-to-date with the latest industry trends.
        </p>
        <p className="text-lg text-gray-400 text-center">
          In my free time, I enjoy contributing to open-source projects and exploring new technologies, and having fun with my friends. I believe that collaboration and sharing knowledge are key to personal and professional growth.
        </p>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedSkills.map(({ name, icon: Icon, highlight }) => (
            <div
              key={name}
              className="group bg-[#1e1e1e] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300"
            >
              <div className={`p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300
                ${highlight 
                  ? "bg-gradient-to-br from-red-500 to-red-700" 
                  : "bg-red-600/40 hover:bg-red-600/60"
                }`}>
                <Icon className="text-white text-2xl" />
              </div>
              <p className="text-white mt-3 font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unrelated Skills */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4 mt-12">Unrelated Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {unrelatedSkills.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="group bg-[#1e1e1e] hover:bg-[#252525] p-6 rounded-xl shadow-lg border border-[#333333] hover:border-red-600/50 transition-all duration-300"
            >
              <div className="p-3 bg-red-600/40 hover:bg-red-600/60 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-white text-2xl" />
              </div>
              <p className="text-white mt-3 font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
</div>
  )
}

export default About
