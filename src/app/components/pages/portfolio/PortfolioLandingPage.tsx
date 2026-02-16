"use client"

export default function PortfolioLandingPage() {
  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        {/* Header content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Welcome to My Portfolio
          </h2>
          <p className="text-center text-gray-300 mb-4 max-w-3xl mx-auto">
            Backend & Full-Stack Software Engineer
          </p>
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            I'm Ethan Townsend, a Backend & Full-Stack Software Engineer interested in all things tech. Experienced in Java, C#, Node.js, and cloud platforms. Passionate about clean code, performance optimization, and staying current with industry best practices.
          </p>
        </div>
      
        {/* Navigation CTA Section */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-6 px-4">
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Explore my <span className="text-red-500 font-semibold">certifications</span>, <span className="text-red-500 font-semibold">skills</span>, <span className="text-red-500 font-semibold">experience</span>, <span className="text-red-500 font-semibold">education</span>, <span className="text-red-500 font-semibold">projects</span>, and <span className="text-red-500 font-semibold">repositories</span> using the navigation above.
          </p>
        </div>

        {/* Resume Information Section */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl py-4 px-4 mt-4">
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            You can view and download my <span className="text-red-500 font-semibold">resume</span> from the sidebar.
          </p>
        </div>
      </div>
    </>
  )
}
