"use client"

import { Suspense } from "react"
import HomeClient from "./components/pages/HomeClient"
import { useEffect, useState } from "react"
import SecurityPolicyModal from "./components/SecurityPolicyModal"

/**
 * Main page component for the portfolio website
 * This is the root page that renders the entire portfolio application
 * Handles the display of the security policy modal when accessed via URL hash
 */
export default function Page() {
  // State to control the visibility of the security policy modal
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  // Check if the page was accessed with a security policy hash
  // and show the modal if needed
  useEffect(() => {
    if (window.location.hash === '#security-policy') {
      setShowSecurityPolicy(true)
    }
  }, [])

  return (
    <Suspense fallback={null}>
      {/* Main portfolio content */}
      <HomeClient />
      
      {/* Conditional security policy modal */}
      {showSecurityPolicy && (
        <SecurityPolicyModal onClose={() => setShowSecurityPolicy(false)} />
      )}
    </Suspense>
  )
}