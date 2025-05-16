"use client"

export default function Status() {

  return (
<div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 shadow-md text-white max-w-md mx-auto mt-8 text-center transition-transform duration-200 ease-out hover:scale-105">
        <div className="flex flex-col items-center relative mb-4">
            <h2 className="text-2xl font-semibold mb-2">Current Status</h2>
            <span className="w-32 h-[1px] mt-1 bg-gradient-to-r from-red-600 to-red-500"></span>
            </div>
      <p className="text-yellow-300 font-medium">Student</p>
        <p className="text-orange-400 text-lg">Looking for Work</p>
    </div>
  )
}