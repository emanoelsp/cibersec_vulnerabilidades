import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// VULNERABILIDADE #6: API sem autenticação
export async function POST(request: NextRequest) {
  try {
    // Sem verificação de autenticação!
    const orderData = await request.json()

    const ordersPath = path.join(process.cwd(), "data", "orders.json")
    const ordersData = fs.readFileSync(ordersPath, "utf8")
    const orders = JSON.parse(ordersData)

    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: "pending",
      date: new Date().toISOString(),
    }

    // VULNERABILIDADE #3: Armazenando dados sensíveis do cartão
    console.log("Dados do pedido (incluindo cartão):", newOrder)

    orders.push(newOrder)

    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2))

    return NextResponse.json({ success: true, orderId: newOrder.id })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const ordersPath = path.join(process.cwd(), "data", "orders.json")
    const ordersData = fs.readFileSync(ordersPath, "utf8")
    let orders = JSON.parse(ordersData)

    // VULNERABILIDADE #5: Acesso a pedidos sem validação adequada
    if (userId) {
      orders = orders.filter((order: any) => order.userId === Number.parseInt(userId))
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar pedidos" }, { status: 500 })
  }
}
