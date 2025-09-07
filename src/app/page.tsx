"use client"

import { Suspense } from "react"
import HomeClient from "./components/pages/HomeClient"
import { useEffect, useState } from "react"
import { SecurityPolicyModal } from "@snxethan/snex-components"

export default function Page() {
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#security-policy') {
      setShowSecurityPolicy(true)
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <HomeClient />
      {showSecurityPolicy && (
        <SecurityPolicyModal onClose={() => setShowSecurityPolicy(false)} />
      )}
    </Suspense>
  )
}