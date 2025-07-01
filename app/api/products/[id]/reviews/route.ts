import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// VULNERABILIDADE #6: API sem validação de autorização
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userName, rating, comment } = await request.json()

    // Sem verificação de autenticação ou autorização!
    // Qualquer pessoa pode adicionar avaliações

    const productsPath = path.join(process.cwd(), "data", "products.json")
    const productsData = fs.readFileSync(productsPath, "utf8")
    const products = JSON.parse(productsData)

    const productIndex = products.findIndex((p: any) => p.id === Number.parseInt(params.id))

    if (productIndex === -1) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    if (!products[productIndex].reviews) {
      products[productIndex].reviews = []
    }

    const newReview = {
      id: Date.now(),
      userName: userName, // VULNERABILIDADE #2: Não sanitiza o nome
      rating: rating,
      comment: comment, // VULNERABILIDADE #2: Não sanitiza o comentário (XSS)
      date: new Date().toLocaleDateString("pt-BR"),
    }

    products[productIndex].reviews.push(newReview)

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))

    return NextResponse.json({ success: true, review: newReview })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
