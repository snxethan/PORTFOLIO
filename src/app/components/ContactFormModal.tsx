"use client"

import { useState, useEffect } from "react"
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
    } catch (err) {
      console.error(err)
      toast.error("Network error. Please try again later.")
    }
  }

  useEffect(() => {
    // Add a class to the body to prevent scrolling when the modal is open
    // This is done to prevent the background from scrolling when the modal is open
    document.body.classList.add("overflow-hidden") // Prevent scrolling
    return () => document.body.classList.remove("overflow-hidden") // Remove the class when the modal is closed
  }, [])

  const close = () => {
    // Close the modal and remove the class from the body
    setIsAnimatingOut(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
    // This is the modal overlay. It covers the entire screen and has a semi-transparent background.
      // It also has a blur effect to make the background less distracting.
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <div
      // This is the modal content. It contains the form and the close button.
        // It has a dark background and a border to make it stand out.
        className={`bg-[#1e1e1e] text-white border border-[#333] rounded-xl p-6 max-w-md w-full relative ${
          isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"
        }`} // This is the modal content. It contains the form and the close button.
        // The className is used to apply the animation and styles to the modal.
        onClick={(e) => e.stopPropagation()} // Prevent the click event from bubbling up to the overlay
        // This is done to prevent the modal from closing when the user clicks inside it.
      >
        <button
          onClick={close} // This is the close button. It is an "X" icon that closes the modal when clicked.
          // It has a hover effect to make it more interactive.
          className="absolute top-1 right-3 text-3xl text-gray-400 hover:text-red-500"
        >
          &times; {/* This is the close button. It is an "X" icon that closes the modal when clicked. */}
        </button>

        <h3 className="text-xl font-semibold mb-4">Contact Me</h3>
      
        <form onSubmit={handleSubmit} className="space-y-4"> {/* This is the form element. It contains the input fields and the submit button. */}
          <input
            type="text"
            required
            placeholder="Your Name"
            className="w-full p-2 bg-[#2a2a2a] rounded border border-[#444]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            className="w-full p-2 bg-[#2a2a2a] rounded border border-[#444]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            required
            placeholder="Your Message"
            className="w-full p-2 bg-[#2a2a2a] rounded border border-[#444] h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
