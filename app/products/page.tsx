"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  // VULNERABILIDADE #5: Busca via parâmetro URL manipulável
  const handleSearch = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get("search") || searchTerm

    if (searchQuery) {
      // VULNERABILIDADE #2: XSS através da busca
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)

      // Atualiza a URL com o termo de busca (vulnerável a manipulação)
      window.history.pushState({}, "", `?search=${searchQuery}`)
    } else {
      setFilteredProducts(products)
    }
  }

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nossos Produtos</h1>

        {/* VULNERABILIDADE #2: Campo de busca vulnerável a XSS */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar produtos... (tente: <script>alert('XSS')</script>)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>

        {/* VULNERABILIDADE #2: Exibição do termo de busca sem sanitização */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-gray-600">
              Resultados para: <span dangerouslySetInnerHTML={{ __html: searchTerm }} />
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                }}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Estoque: {product.stock}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 space-x-2">
              <Button onClick={() => addToCart(product)} className="flex-1" disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? "Sem Estoque" : "Adicionar"}
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline">Ver Detalhes</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  )
}
