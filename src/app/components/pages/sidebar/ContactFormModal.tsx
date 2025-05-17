"use client"

import { useState, useEffect } from "react"
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

export default function ContactFormModal({ onClose }: Props) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

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
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  const close = () => {
    setIsAnimatingOut(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className={`bg-[#1e1e1e] text-white border border-[#333] rounded-xl p-6 max-w-md w-full relative ${
          isAnimatingOut ? "animate-elastic-out" : "animate-elastic-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-1 right-3 text-3xl text-gray-400 hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4">Contact Me</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
