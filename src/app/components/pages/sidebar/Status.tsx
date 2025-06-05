"use client"

import { useState } from "react"
import ContactFormModal from "../../ContactFormModal"
import { IoIosContact } from "react-icons/io";

// This component is used to display the current status of the user. It shows the user's current status and a button to contact them.
// The status is displayed in a card-like component with a gradient background and a hover effect.
// The button to contact the user opens a modal with a contact form.
// The modal can be closed by clicking outside of it or by clicking the close button.
// The component is a functional component that uses React hooks to manage state and effects.
export default function Status() {
  const [showContact, setShowContact] = useState(false) // State to control the visibility of the contact form modal

  return (
    <>
        {/* Status Card */}
       <div className="bg-[#1e1e1e] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 shadow-lg text-white max-w-md mx-auto mt-10 text-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
            Looking for Work
          </h2>
          <div className="w-20 h-[2px] mt-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
        </div>

          <p className="text-gray-400 text-sm mb-4">
            I’m currently open to full-time or internship software development opportunities.
          </p>

          <button
            onClick={() => setShowContact(true)}
            className="inline-flex items-center justify-center px-4 py-2 mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg gap-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
            // className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2  "
          >
            <IoIosContact className="w-5 h-5" /> {/* Optional: Explicitly size the icon */}
            Send me a message!
          </button>
      </div>

      {/* Contact form modal */}
      {/* This modal is displayed when the user clicks the "Contact Me" button. */}
      {/* It contains a form for the user to fill out and send a message. */}
      {/* The modal can be closed by clicking outside of it or by clicking the close button. */}
      {showContact && <ContactFormModal onClose={() => setShowContact(false)} />}
    </>
  )
}
