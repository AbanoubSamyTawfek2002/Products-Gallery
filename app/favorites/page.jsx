"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Loader2, ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])

  // Add authentication check and redirect
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Add loading states for buttons
  const [favoriteLoading, setFavoriteLoading] = useState({})
  const [cartLoading, setCartLoading] = useState({})

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    loadFavoriteProducts()

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const loadFavoriteProducts = async () => {
    try {
      const savedFavorites = localStorage.getItem("favorites")
      if (!savedFavorites) {
        setLoading(false)
        return
      }

      const favoriteIds = JSON.parse(savedFavorites)
      setFavorites(favoriteIds)

      if (favoriteIds.length === 0) {
        setLoading(false)
        return
      }

      const products = await Promise.all(
        favoriteIds.map(async (id) => {
          const response = await fetch(`https://fakestoreapi.com/products/${id}`)
          return response.json()
        }),
      )

      setFavoriteProducts(products)
    } catch (error) {
      console.error("Failed to load favorite products:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromFavorites = async (productId) => {
    setFavoriteLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newFavorites = favorites.filter((id) => id !== productId)
      setFavorites(newFavorites)
      setFavoriteProducts((products) => products.filter((p) => p.id !== productId))
      localStorage.setItem("favorites", JSON.stringify(newFavorites))

      toast({
        variant: "success",
        title: "Removed from Favorites",
        description: "Product removed from favorites successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const addToCart = async (productId) => {
    setCartLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newCart = [...cart, productId]
      setCart(newCart)
      localStorage.setItem("cart", JSON.stringify(newCart))

      toast({
        variant: "success",
        title: "Added to Cart",
        description: "Product added to cart successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  // Add authentication guard at the beginning of the component render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please login to view favorites</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-muted h-48 rounded-md mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <Badge variant="secondary">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Start adding products to your favorites</p>
            <Link href="/">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur"
                      onClick={() => removeFromFavorites(product.id)}
                      disabled={favoriteLoading[product.id]}
                    >
                      {favoriteLoading[product.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </Button>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary">{product.title}</h3>
                  </Link>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      className="ml-2"
                      disabled={cartLoading[product.id]}
                    >
                      {cartLoading[product.id] ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-1" />
                      )}
                      {cartLoading[product.id] ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
