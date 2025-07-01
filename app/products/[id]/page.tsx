"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  reviews: Review[]
}

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewerName, setReviewerName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return

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

  // VULNERABILIDADE #2: XSS através das avaliações
  const submitReview = async () => {
    if (!reviewText || !reviewerName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos da avaliação",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: reviewerName,
          rating: reviewRating,
          comment: reviewText,
        }),
      })

      if (response.ok) {
        toast({
          title: "Avaliação enviada!",
          description: "Sua avaliação foi adicionada com sucesso",
        })
        setReviewText("")
        setReviewerName("")
        setReviewRating(5)
        fetchProduct() // Recarrega o produto com a nova avaliação
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Produto não encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=400"
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
            <span className="text-gray-500">Estoque: {product.stock} unidades</span>
          </div>

          <Button onClick={addToCart} size="lg" className="w-full" disabled={product.stock === 0}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
          </Button>
        </div>
      </div>

      {/* Seção de Avaliações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Deixe sua Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reviewer-name">Seu Nome</Label>
              <Input
                id="reviewer-name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <Label htmlFor="rating">Nota (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number.parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="review">Comentário</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Conte sua experiência com o produto... (HTML permitido para 'formatação')"
                rows={4}
              />
            </div>

            <Button onClick={submitReview} className="w-full">
              Enviar Avaliação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações dos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {/* VULNERABILIDADE #2: XSS através do comentário da avaliação */}
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: review.comment }} />
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma avaliação ainda. Seja o primeiro!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
