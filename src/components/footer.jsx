import { Heart, Github, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/">
              <h3 className="text-xl font-bold hover:text-primary cursor-pointer transition-colors">
                Products Gallery
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your ultimate destination for discovering amazing products with a modern shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link
                to="/favorites"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Favorites
              </Link>
              <Link to="/cart" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Shopping Cart
              </Link>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Login
              </Link>
            </div>
          </div>

          {/* Developer Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Developer</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Created by:</span>{" "}
                <span className="font-medium">Abanoub Samy</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Nickname:</span> <span className="font-medium">Pepo 😉</span>
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://www.linkedin.com/in/pepo-abanob-472189255/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/AbanoubSamyTawfek2002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Products Gallery. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" /> by Pepo
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
