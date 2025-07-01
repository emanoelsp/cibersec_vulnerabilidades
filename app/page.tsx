import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Shield, Users, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Bem-vindo ao SecureShop</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">O melhor e-commerce para seus estudos de segurança</p>
          <div className="space-x-4">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Produtos
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o SecureShop?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
                <p className="text-gray-600">Sistema desenvolvido com as melhores práticas de segurança</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Milhares de Usuários</h3>
                <p className="text-gray-600">Confiança de milhares de clientes satisfeitos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Qualidade Premium</h3>
                <p className="text-gray-600">Produtos selecionados com a melhor qualidade</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 mb-8">Explore nosso catálogo e encontre os melhores produtos</p>
          <Link href="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Explorar Produtos
            </Button>
          </Link>
        </div>
      </section>

      {/* VULNERABILIDADE #9: Comentário sobre falta de HTTPS */}
      {/* 
        ATENÇÃO: Este sistema não utiliza HTTPS em produção, 
        permitindo interceptação de dados sensíveis durante a transmissão.
        Todos os dados de login, senhas e informações pessoais são 
        transmitidos em texto plano, vulneráveis a ataques man-in-the-middle.
      */}
    </div>
  )
}
