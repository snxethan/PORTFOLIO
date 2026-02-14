"use client"

export default function PortfolioLandingPage() {
  return (
    <>
      {/* Header section - wrapped in styled container */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 mb-6 animate-fadeInScale">
        {/* Header content */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-transform duration-200 ease-out hover:scale-110">
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
      </div>

      {/* View Resume Section */}
      <div className="bg-[#222222] rounded-xl border border-[#333333] p-6 animate-fadeInScale">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            View My Resume
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Download or preview my complete resume showcasing my experience, education, and technical skills.
          </p>
          <button
            onClick={() => {
              window.open('/resume/EthanTownsend_Resume_v2.1.pdf', '_blank')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-red-600/40 hover:shadow-red-600/60"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            View Resume
          </button>
        </div>
      </div>
    </>
  )
}
