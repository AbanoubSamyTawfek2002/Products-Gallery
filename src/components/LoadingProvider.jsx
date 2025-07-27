import { createContext, useContext, useState } from "react"
import LoadingScreen from "./LoadingScreen"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("جاري تحميل البيانات...")

  const showLoading = (message = "جاري تحميل البيانات...") => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
    setLoadingMessage("جاري تحميل البيانات...")
  }

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <LoadingScreen message={loadingMessage} />
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
} 