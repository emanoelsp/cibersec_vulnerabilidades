import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    const productsPath = path.join(process.cwd(), "data", "products.json")
    const productsData = fs.readFileSync(productsPath, "utf8")
    let products = JSON.parse(productsData)

    // VULNERABILIDADE #5: Injeção via parâmetros de query
    // Permite manipulação direta dos dados através da URL
    if (search) {
      // Filtro inseguro que pode ser explorado
      const searchQuery = search.toLowerCase()
      products = products.filter((product: any) => {
        // VULNERABILIDADE: eval() ou similar poderia ser explorado aqui
        return (
          product.name.toLowerCase().includes(searchQuery) || product.description.toLowerCase().includes(searchQuery)
        )
      })
    }

    if (category) {
      products = products.filter((product: any) => product.category.toLowerCase() === category.toLowerCase())
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 })
  }
}

// VULNERABILIDADE #6: Endpoint POST sem autenticação
export async function POST(request: NextRequest) {
  try {
    // Sem verificação de autenticação!
    // Qualquer pessoa pode adicionar produtos

    const productData = await request.json()

    const productsPath = path.join(process.cwd(), "data", "products.json")
    const productsData = fs.readFileSync(productsPath, "utf8")
    const products = JSON.parse(productsData)

    const newProduct = {
      id: Date.now(),
      ...productData,
      reviews: [],
    }

    products.push(newProduct)

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))

    return NextResponse.json({ success: true, product: newProduct })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
