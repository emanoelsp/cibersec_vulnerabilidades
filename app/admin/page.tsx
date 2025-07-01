"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Upload, Users, Package, ShoppingCart } from "lucide-react"

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // VULNERABILIDADE #4: Acesso ao admin sem verificação adequada
    // Não verifica se o usuário é realmente admin
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/users"), // VULNERABILIDADE #6: API exposta sem autenticação
        fetch("/api/orders"),
      ])

      setProducts(await productsRes.json())
      setUsers(await usersRes.json())
      setOrders(await ordersRes.json())
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number.parseFloat(newProduct.price),
          stock: Number.parseInt(newProduct.stock),
        }),
      })

      if (response.ok) {
        toast({
          title: "Produto adicionado!",
          description: "O produto foi adicionado com sucesso",
        })
        setNewProduct({
          name: "",
          price: "",
          description: "",
          category: "",
          stock: "",
          image: "",
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive",
      })
    }
  }

  // VULNERABILIDADE #10: Upload de arquivos sem validação
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // Simula upload sem validação de tipo de arquivo
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setNewProduct((prev) => ({ ...prev, image: data.url }))
        toast({
          title: "Upload realizado!",
          description: "Arquivo enviado com sucesso",
        })
      }
    } catch (error) {
      console.error("Erro no upload:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

      {/* VULNERABILIDADE #4: Aviso sobre acesso não verificado */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          ⚠️ <strong>Acesso Administrativo Detectado</strong> - Este painel está acessível sem verificação adequada de
          permissões.
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="/placeholder.svg?height=300&width=300"
                  />
                </div>
                <div className="col-span-2">
                  <Button type="submit" className="w-full">
                    Adicionar Produto
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Cadastrados ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2 bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                      }}
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-green-600 font-bold">R$ {product.price}</p>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {/* VULNERABILIDADE #3: Exposição de dados sensíveis dos usuários */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">ID</th>
                      <th className="border border-gray-300 p-2 text-left">Nome</th>
                      <th className="border border-gray-300 p-2 text-left">Email</th>
                      <th className="border border-gray-300 p-2 text-left">Senha</th>
                      <th className="border border-gray-300 p-2 text-left">CPF</th>
                      <th className="border border-gray-300 p-2 text-left">Telefone</th>
                      <th className="border border-gray-300 p-2 text-left">Endereço</th>
                      <th className="border border-gray-300 p-2 text-left">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id}>
                        <td className="border border-gray-300 p-2">{user.id}</td>
                        <td className="border border-gray-300 p-2">{user.name}</td>
                        <td className="border border-gray-300 p-2">{user.email}</td>
                        <td className="border border-gray-300 p-2 font-mono text-red-600">{user.password}</td>
                        <td className="border border-gray-300 p-2">{user.cpf}</td>
                        <td className="border border-gray-300 p-2">{user.phone}</td>
                        <td className="border border-gray-300 p-2">{user.address}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge variant={user.role === "admin" ? "destructive" : "default"}>{user.role}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Realizados ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Pedido #{order.id}</span>
                      <Badge>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cliente ID: {order.userId} | Total: R$ {order.total?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Data: {new Date(order.date).toLocaleDateString("pt-BR")}</p>
                    {/* VULNERABILIDADE #3: Exposição de dados de pagamento */}
                    {order.paymentInfo && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                        <strong>Dados do Cartão (EXPOSTOS!):</strong>
                        <br />
                        Número: {order.paymentInfo.cardNumber}
                        <br />
                        Nome: {order.paymentInfo.cardName}
                        <br />
                        Validade: {order.paymentInfo.cardExpiry}
                        <br />
                        CVV: {order.paymentInfo.cardCvv}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* VULNERABILIDADE #10: Upload sem validação */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Selecione qualquer arquivo para upload (sem validação de tipo)</p>
                  <Input type="file" onChange={handleFileUpload} className="max-w-xs mx-auto" />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Vulnerabilidade de Upload:</strong> Este sistema aceita qualquer tipo de arquivo sem
                    validação, permitindo upload de scripts maliciosos, executáveis e outros arquivos perigosos.
                  </p>
                </div>

                {selectedFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Arquivo selecionado:</strong> {selectedFile.name}
                      <br />
                      <strong>Tipo:</strong> {selectedFile.type || "Desconhecido"}
                      <br />
                      <strong>Tamanho:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
