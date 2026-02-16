"use client"
import Footer from "./components/pages/Footer"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  
  const handleGoHome = () => {
    router.replace("/?page=portfolio")
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-8 shadow-2xl text-white max-w-2xl w-full text-center">
          <div className="mb-6">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text mb-4">
              404
            </h1>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Page Not Found
            </h2>
            <div className="w-32 h-[2px] mx-auto bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
          </div>

          <p className="text-gray-400 text-lg mb-8">
            The content you&apos;re looking for is not available.
          </p>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105"
          >
            Return to Homepage
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
