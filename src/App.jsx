import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/toaster"
import { Footer } from "./components/footer"
import { LoadingProvider } from "./components/LoadingProvider"
import HomePage from "./pages/HomePage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import FavoritesPage from "./pages/FavoritesPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LoadingProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
