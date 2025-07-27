import { Card, CardContent } from "./ui/card"

export default function LoadingSkeleton({ 
  type = "product-card",
  count = 1 
}) {
  const renderProductCardSkeleton = () => (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="bg-muted h-48 rounded-md mb-4"></div>
        <div className="bg-muted h-4 rounded mb-2"></div>
        <div className="bg-muted h-4 rounded w-2/3 mb-2"></div>
        <div className="bg-muted h-3 rounded w-1/2 mb-2"></div>
        <div className="bg-muted h-6 rounded w-1/3"></div>
      </CardContent>
    </Card>
  )

  const renderProductGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {renderProductCardSkeleton()}
        </div>
      ))}
    </div>
  )

  const renderProductDetailsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="bg-muted h-96 rounded-lg animate-pulse"></div>
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted h-20 w-20 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-muted h-8 rounded w-3/4 animate-pulse"></div>
        <div className="bg-muted h-6 rounded w-1/2 animate-pulse"></div>
        <div className="bg-muted h-4 rounded w-full animate-pulse"></div>
        <div className="bg-muted h-4 rounded w-2/3 animate-pulse"></div>
        <div className="bg-muted h-4 rounded w-4/5 animate-pulse"></div>
        <div className="bg-muted h-12 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  )

  const renderTableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="bg-muted h-12 w-12 rounded-md animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-4 rounded w-3/4 animate-pulse"></div>
            <div className="bg-muted h-3 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="bg-muted h-8 w-20 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )

  switch (type) {
    case "product-card":
      return renderProductCardSkeleton()
    case "product-grid":
      return renderProductGridSkeleton()
    case "product-details":
      return renderProductDetailsSkeleton()
    case "table":
      return renderTableSkeleton()
    default:
      return renderProductCardSkeleton()
  }
} 