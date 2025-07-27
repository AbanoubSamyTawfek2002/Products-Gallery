"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (!savedCart) {
        setLoading(false)
        return
      }

      const cartProductIds = JSON.parse(savedCart)
      const productCounts = {}

      cartProductIds.forEach((id) => {
        productCounts[id] = (productCounts[id] || 0) + 1
      })

      const uniqueIds = Object.keys(productCounts).map(Number)
      const products = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await fetch(`https://fakestoreapi.com/products/${id}`)
          return response.json()
        }),
      )

      const cartItemsWithQuantity = products.map((product) => ({
        ...product,
        quantity: productCounts[product.id],
      }))

      setCartItems(cartItemsWithQuantity)
    } catch (error) {
      console.error("Failed to load cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((items) => items.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))

    // Update localStorage
    const updatedCart = []
    cartItems.forEach((item) => {
      const quantity = item.id === productId ? newQuantity : item.quantity
      for (let i = 0; i < quantity; i++) {
        updatedCart.push(item.id)
      }
    })
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId))

    // Update localStorage
    const updatedCart = []
    cartItems.forEach((item) => {
      if (item.id !== productId) {
        for (let i = 0; i < item.quantity; i++) {
          updatedCart.push(item.id)
        }
      }
    })
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    toast({
      variant: "success",
      title: "Removed from Cart",
      description: "Product removed from cart successfully",
    })
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please login to view shopping cart</p>
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
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="bg-muted h-20 w-20 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted h-4 rounded w-3/4"></div>
                      <div className="bg-muted h-4 rounded w-1/2"></div>
                    </div>
                  </div>
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
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold hover:text-primary line-clamp-2">{item.title}</h3>
                        </Link>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
