"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SortAsc, ShoppingCart, Heart, Star, Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import useTheme from "../hooks/use-theme";
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../hooks/use-toast"
import LoadingScreen from "../components/LoadingScreen"
import LoadingSkeleton from "../components/LoadingSkeleton"
import LoadingSpinner from "../components/LoadingSpinner"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [favoriteLoading, setFavoriteLoading] = useState({})
  const [cartLoading, setCartLoading] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchCategories()

    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    if (token) {
      const savedFavorites = localStorage.getItem("favorites")
      const savedCart = localStorage.getItem("cart")
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
      if (savedCart) setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, sortBy, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://fakestoreapi.com/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products/categories")
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch categories")
    }
  }

  const filterAndSortProducts = () => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory),
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-desc":
          return b.title.localeCompare(a.title)
        default:
          return a.title.localeCompare(b.title)
      }
    })

    setFilteredProducts(filtered)
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

    setFavoriteLoading((prev) => ({ ...prev, [productId]: true }))

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
      setFavoriteLoading((prev) => ({ ...prev, [productId]: false }))
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="product-grid" count={8} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <h1 className="text-2xl font-bold hover:text-primary cursor-pointer transition-colors">
                  Products Gallery
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/favorites">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-5 w-5" />
                      {favorites.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                          {favorites.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token")
                      localStorage.removeItem("user")
                      localStorage.removeItem("favorites")
                      localStorage.removeItem("cart")
                      setIsAuthenticated(false)
                      setFavorites([])
                      setCart([])
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                      onClick={() => toggleFavorite(product.id)}
                      disabled={!isAuthenticated || favoriteLoading[product.id]}
                    >
                      {favoriteLoading[product.id] ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          } ${!isAuthenticated ? "opacity-50" : ""}`}
                        />
                      )}
                    </Button>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary">{product.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating.rate} ({product.rating.count})
                    </span>
                  </div>
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
                      disabled={!isAuthenticated || cartLoading[product.id]}
                    >
                      {cartLoading[product.id] ? (
                        <LoadingSpinner size="small" className="mr-1" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-1" />
                      )}
                      {cartLoading[product.id] ? "Adding..." : isAuthenticated ? "Add to Cart" : "Login Required"}
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
