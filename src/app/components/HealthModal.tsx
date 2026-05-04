"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSyncAlt } from "react-icons/fa"
import { X } from "lucide-react"

interface HealthCheckResult {
  path: string
  ok: boolean
  status?: number
  statusText?: string
  latencyMs?: number
  error?: string
  contentType?: string
}

interface HealthModalProps {
  onClose: () => void
}

export default function HealthModal({ onClose }: HealthModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [checking, setChecking] = useState(true)
  const [results, setResults] = useState<HealthCheckResult[]>([])

  useEffect(() => {
    setMounted(true)
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  useEffect(() => {
    runChecks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const endpoints = [
    { path: "/api/spotify/now-playing", method: "GET" },
    { path: "/api/spotify/login", method: "GET" },
    { path: "/api/spotify/callback", method: "GET" },
    { path: "/resume.pdf", method: "GET" }, // Resume export/route (remote Google Doc or fallback PDF)
  ]

  async function probe(path: string) {
    const start = performance.now()
    try {
      const res = await fetch(path, { method: "GET", cache: "no-store" })
      const latency = Math.round(performance.now() - start)
      const contentType = res.headers.get("content-type") ?? undefined
      return {
        path,
        ok: res.status >= 200 && res.status < 400 || res.status === 405,
        status: res.status,
        statusText: res.statusText,
        contentType,
        latencyMs: latency,
      } as HealthCheckResult
    } catch (err: any) {
      const latency = Math.round(performance.now() - start)
      return {
        path,
        ok: false,
        error: err?.message ?? String(err),
        latencyMs: latency,
      } as HealthCheckResult
    }
  }

  async function runChecks() {
    setChecking(true)
    setResults([])
    try {
      const promises = endpoints.map(e => probe(e.path))
      const res = await Promise.all(promises)
      setResults(res)
    } finally {
      setChecking(false)
    }
  }

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => onClose(), 260)
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>
      <div className={`bg-[#222222] rounded-xl border border-[#333333] shadow-lg p-6 relative max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"}`} onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-4">
          <h1 className="text-3xl font-bold text-white mb-4 relative text-center">
            API & Route Health
            <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500"></span>
          </h1>

          <div className="absolute top-0 right-0 flex items-center gap-2">
            <button
              onClick={runChecks}
              aria-label="Refresh checks"
              className="inline-flex items-center justify-center p-1 text-gray-400 hover:text-red-600 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-full"
            >
              <FaSyncAlt size={20} className={checking ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleClose}
              aria-label="Close"
              className="inline-flex items-center justify-center p-1 text-gray-400 hover:text-red-600 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {checking && (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between bg-[#1b1b1b] p-3 rounded border border-[#333333] animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-4 bg-[#333333] rounded" />
                    <div className="w-32 h-3 bg-[#2b2b2b] rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-3 bg-[#2b2b2b] rounded" />
                    <div className="w-4 h-4 bg-[#333333] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!checking && results.length === 0 && (
            <div className="text-gray-400">No checks completed yet.</div>
          )}

          {!checking && results.map(r => (
            <div
              key={r.path}
              className="group flex items-center justify-between bg-[#1b1b1b] p-3 rounded border border-[#333333] transition-all duration-200 ease-out hover:scale-[1.01] hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.12)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-48 text-sm text-gray-200">{r.path}</div>
                <div className="text-xs text-gray-400">{r.status ? `${r.status} ${r.statusText}` : r.error ?? "No response"}</div>
                {r.contentType && <div className="text-xs text-gray-400">· {r.contentType}</div>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400">{r.latencyMs !== undefined ? `${r.latencyMs}ms` : "-"}</div>
                {r.ok ? (
                  <FaCheckCircle className="text-green-500" />
                ) : r.status && r.status >= 500 ? (
                  <FaTimesCircle className="text-red-500" />
                ) : (
                  <FaExclamationTriangle className="text-yellow-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

