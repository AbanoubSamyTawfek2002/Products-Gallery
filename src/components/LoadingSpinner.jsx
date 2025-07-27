import { Loader2 } from "lucide-react"

export default function LoadingSpinner({ 
  size = "default", 
  className = "" 
}) {
  const sizeClasses = {
    xs: "w-3 h-3",
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  }

  return (
    <Loader2 
      className={`${sizeClasses[size]} animate-spin ${className}`} 
    />
  )
} 