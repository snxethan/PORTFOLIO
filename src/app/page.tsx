"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import HomeClient from "./components/pages/HomeClient"
import { useEffect, useState } from "react"
import SecurityPolicyModal from "./components/SecurityPolicyModal"

function PageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = searchParams.get("page")
  const [showSecurityPolicy, setShowSecurityPolicy] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#security-policy') {
      setShowSecurityPolicy(true)
    }
    
    // Default landing: redirect to portfolio/projects
    if (!page) {
      router.replace('?page=portfolio/projects')
      return
    }
    
    // Handle legacy URLs - redirect to new portfolio structure
    const parts = page.split('/')
    const mainPage = parts[0]
    const subPage = parts[1]
    
    // Legacy format redirects
    if (mainPage === 'about') {
      if (subPage === 'certifications') {
        router.replace('?page=portfolio/certifications')
      } else if (subPage === 'skills') {
        router.replace('?page=portfolio/skills')
      }
    } else if (mainPage === 'resume') {
      if (subPage === 'experience') {
        router.replace('?page=portfolio/experience')
      } else if (subPage === 'education') {
        router.replace('?page=portfolio/education')
      }
    } else if (mainPage === 'portfolio') {
      if (subPage === 'repositories') {
        router.replace('?page=portfolio/repos')
      }
      // portfolio/projects stays the same
    }
  }, [page, router])

  // If no page parameter, show nothing while redirecting
  // Otherwise show the normal HomeClient with tabs
  return (
    <>
      {!page ? null : <HomeClient />}
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