import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productsPath = path.join(process.cwd(), "data", "products.json")
    const productsData = fs.readFileSync(productsPath, "utf8")
    const products = JSON.parse(productsData)

    const product = products.find((p: any) => p.id === Number.parseInt(params.id))

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar produto" }, { status: 500 })
  }
}
