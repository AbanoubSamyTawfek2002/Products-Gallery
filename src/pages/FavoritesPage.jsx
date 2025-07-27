"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import useTheme from "../hooks/use-theme"
import { useToast } from "../hooks/use-toast"
import LoadingSkeleton from "../components/LoadingSkeleton"
import LoadingSpinner from "../components/LoadingSpinner"

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [favoriteLoading, setFavoriteLoading] = useState({})
  const [cartLoading, setCartLoading] = useState({})

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    setIsAuthenticated(true)
    loadFavoriteProducts()

    const savedCart = localStorage.getItem("cart")
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [navigate])

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please login to view favorites</p>
          <Link to="/login">
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
          <LoadingSkeleton type="product-grid" count={4} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
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
                        <LoadingSpinner size="small" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </Button>
                  </div>
                  <Link to={`/products/${product.id}`}>
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
                        <LoadingSpinner size="small" className="mr-1" />
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
