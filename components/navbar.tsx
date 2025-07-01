"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Shield } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // VULNERABILIDADE #3: Exposição de dados sensíveis no localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      // Expondo dados sensíveis como CPF e endereço no console
      console.log("Dados do usuário logado:", parsedUser)
    }

    const cart = localStorage.getItem("cart")
    if (cart) {
      const cartItems = JSON.parse(cart)
      setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    setUser(null)
    setCartCount(0)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SecureShop</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost">Produtos</Button>
            </Link>

            {user ? (
              <>
                <span className="text-sm text-gray-600">Olá, {user.name}</span>
                {/* VULNERABILIDADE #4: Acesso ao admin sem verificação adequada */}
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Sair
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
