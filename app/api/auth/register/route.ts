import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const usersPath = path.join(process.cwd(), "data", "users.json")
    const usersData = fs.readFileSync(usersPath, "utf8")
    const users = JSON.parse(usersData)

    // Verifica se email já existe
    const existingUser = users.find((user: any) => user.email === userData.email)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email já cadastrado",
        },
        { status: 400 },
      )
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // VULNERABILIDADE #1: Senha em texto plano
      phone: userData.phone,
      cpf: userData.cpf,
      address: userData.address,
      role: "user",
    }

    users.push(newUser)

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
