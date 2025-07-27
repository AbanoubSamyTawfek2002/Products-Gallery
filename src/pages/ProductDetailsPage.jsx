"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Heart, Star, Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Link } from "react-router-dom"
import useTheme from "../hooks/use-theme"
import { useToast } from "../hooks/use-toast"
import LoadingSkeleton from "../components/LoadingSkeleton"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }

    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    if (token) {
      const savedFavorites = localStorage.getItem("favorites")
      const savedCart = localStorage.getItem("cart")
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
      if (savedCart) setCart(JSON.parse(savedCart))
    }
  }, [id])

  const fetchProduct = async (productId) => {
    try {
      setLoading(true)
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
      if (!response.ok) throw new Error("Product not found")
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError("Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login first to add products to favorites",
      })
      return
    }

    setFavoriteLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const isAlreadyFavorite = favorites.includes(productId)
      const newFavorites = isAlreadyFavorite ? favorites.filter((id) => id !== productId) : [...favorites, productId]

      setFavorites(newFavorites)
      localStorage.setItem("favorites", JSON.stringify(newFavorites))

      toast({
        variant: "success",
        title: isAlreadyFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isAlreadyFavorite
          ? "Product removed from favorites successfully"
          : "Product added to favorites successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login first to add products to cart",
      })
      return
    }

    setCartLoading(true)

    try {
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
      setCartLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="product-details" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating.rate}</span>
                  <span className="text-muted-foreground">({product.rating.count} reviews)</span>
                </div>
                <Badge variant="outline">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">${product.price}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => addToCart(product.id)}
                className="flex-1"
                disabled={!isAuthenticated || cartLoading}
              >
                {cartLoading ? (
                  <LoadingSpinner size="default" className="mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {cartLoading ? "Adding to Cart..." : isAuthenticated ? "Add to Cart" : "Login Required"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite(product.id)}
                disabled={!isAuthenticated || favoriteLoading}
              >
                {favoriteLoading ? (
                  <LoadingSpinner size="default" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${favorites.includes(product.id) && isAuthenticated ? "fill-red-500 text-red-500" : ""} ${!isAuthenticated ? "opacity-50" : ""}`}
                  />
                )}
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-muted-foreground mb-2">Please login to add products to cart or favorites</p>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
