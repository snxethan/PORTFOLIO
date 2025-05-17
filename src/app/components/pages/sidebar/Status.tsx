"use client"

import { useState } from "react"
import ContactFormModal from "./ContactFormModal"

export default function Status() {
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 shadow-md text-white max-w-md mx-auto mt-8 text-center transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
        <div className="flex flex-col items-center relative mb-4">
          <h2 className="text-2xl font-semibold mb-2">Current Status</h2>
          <span className="w-32 h-[1px] mt-1 bg-gradient-to-r from-red-600 to-red-500"></span>
        </div>
        <p className="text-yellow-300 font-medium">Student</p>
        <p className="text-orange-400 text-lg mb-4">Looking for Work</p>

        <button
          onClick={() => setShowContact(true)}
          className="px-4 py-2 mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-md transition-all"
        >
          Contact Me
        </button>
      </div>

      {showContact && <ContactFormModal onClose={() => setShowContact(false)} />}
    </>
  )
}
