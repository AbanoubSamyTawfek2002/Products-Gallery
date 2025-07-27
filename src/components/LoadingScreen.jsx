import { Loader2, ShoppingBag } from "lucide-react"

export default function LoadingScreen({ 
  message = "جاري تحميل البيانات...", 
  showLogo = true,
  size = "default" 
}) {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12", 
    large: "w-16 h-16"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {showLogo && (
          <div className="flex items-center justify-center mb-8">
            <ShoppingBag className="w-12 h-12 text-primary" />
            <h1 className="text-2xl font-bold ml-2">Products Gallery</h1>
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
          <p className="text-muted-foreground text-lg font-medium">{message}</p>
          
          {/* Loading dots animation */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 