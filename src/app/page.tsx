import { Suspense } from "react"
import HomeClient from "./components/pages/HomeClient"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  )
}
