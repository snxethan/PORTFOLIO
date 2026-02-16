"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import toast from 'react-hot-toast'

// This component is used to display a contact form modal. It allows users to send messages to the developer.
// The modal can be closed by clicking outside of it or by clicking the close button.
interface Props {
  onClose: () => void
}

export default function ContactFormModal({ onClose }: Props) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false) // State to control the animation of the modal 
  const [name, setName] = useState("") // State to store the name input
  const [email, setEmail] = useState("") // State to store the email input
  const [message, setMessage] = useState("") // State to store the message input
  const [mounted, setMounted] = useState(false)

  // This function handles the form submission. It sends the name, email, and message to the server.
  // If the submission is successful, it shows a success message and closes the modal.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent the default form submission behavior

    try {
      // Validate the email format
      // Contact the server to send the email
      const response = await fetch("/api/contact", { // api endpoint to send the email
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      // Parse the response from the server
      const data = await response.json().catch(() => ({}))

      if (response.ok) {
  
        toast.success("Message sent successfully!")
        onClose()
      } else {
        toast.error(data.message || "Something went wrong.")
      }
    } catch {
      toast.error("Network error. Please try again later.")
    }
  }

  useEffect(() => {
    // Add a class to the body to prevent scrolling when the modal is open
    // This is done to prevent the background from scrolling when the modal is open
    setMounted(true)
    document.body.classList.add("overflow-hidden") // Prevent scrolling
    return () => document.body.classList.remove("overflow-hidden") // Remove the class when the modal is closed
  }, [])

  const close = () => {
    // Close the modal and remove the class from the body
    setIsAnimatingOut(true)
    setTimeout(onClose, 300)
  }

  const modalContent = (
    <div
    // This is the modal overlay. It covers the entire screen and has a semi-transparent background.
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
      // This is the modal content. It contains the form and the close button.
        // It has a dark background and a border to make it stand out.
        className={`bg-[#1e1e1e] text-white border border-[#333333] rounded-xl p-8 max-w-md w-full relative shadow-2xl ${
          isAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"
        }`} // This is the modal content. It contains the form and the close button.
        // The className is used to apply the animation and styles to the modal.
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden' as const,
          WebkitOverflowScrolling: 'touch' as const
        }}
        onClick={(e) => e.stopPropagation()} // Prevent the click event from bubbling up to the overlay
        // This is done to prevent the modal from closing when the user clicks inside it.
      >
        <button
          onClick={close} // This is the close button. It is an "X" icon that closes the modal when clicked.
          // It has a hover effect to make it more interactive.
          className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          &times; {/* This is the close button. It is an "X" icon that closes the modal when clicked. */}
        </button>

        <div className="mb-6 text-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text mb-2">
            Contact Me
          </h3>
          <div className="w-32 h-[2px] mx-auto bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-4 mb-6"> {/* This is the form element. It contains the input fields and the submit button. */}
          <input
            type="text"
            required
            placeholder="Your Name"
            className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg border border-[#444] focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg border border-[#444] focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            required
            placeholder="Your Message"
            className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg border border-[#444] focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all h-32 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            Send Message
          </button>
        </form>
        
        <div className="pt-4 border-t border-[#333333] text-center">
          <p className="text-gray-400 text-sm">
            Or email me directly:{" "}
            <a 
              href="mailto:snxethan@gmail.com" 
              className="text-red-500 hover:text-red-400 underline transition-colors duration-200"
            >
              snxethan@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )

  // Only render if mounted (client-side) to avoid hydration issues
  if (!mounted) return null

  // Use portal to render the modal at the document root level
  return createPortal(modalContent, document.body)
}
