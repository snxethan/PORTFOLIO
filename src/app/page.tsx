"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import HomeClient from "./components/pages/HomeClient"
import LandingPage from "./components/pages/LandingPage"
import { useEffect, useState } from "react"
import SecurityPolicyModal from "./components/SecurityPolicyModal"

function PageContent() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page")
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#security-policy') {
      setShowSecurityPolicy(true)
    }
  }, [])

  // If no page parameter, show landing page
  // Otherwise show the normal HomeClient with tabs
  return (
    <>
      {!page ? <LandingPage /> : <HomeClient />}
      {showSecurityPolicy && (
        <SecurityPolicyModal onClose={() => setShowSecurityPolicy(false)} />
      )}
    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  )
}