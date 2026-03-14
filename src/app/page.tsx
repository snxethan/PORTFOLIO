"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import HomeClient from "./components/pages/HomeClient"
import SecurityPolicyModal from "./components/SecurityPolicyModal"

function PageContent() {
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash.toLowerCase()

    if (hash === "#security-policy") {
      setShowSecurityPolicy(true)
      return
    }

    if (hash === "#not-found") {
      toast.error("That page does not exist. Redirected to home.")
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    }
  }, [])

  return (
    <>
      <HomeClient />
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