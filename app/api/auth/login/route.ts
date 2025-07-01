import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// VULNERABILIDADE #7: Credenciais hardcoded
const ADMIN_BACKDOOR = {
  email: "backdoor@admin.com",
  password: "secret123",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // VULNERABILIDADE #7: Backdoor de admin hardcoded
    if (email === ADMIN_BACKDOOR.email && password === ADMIN_BACKDOOR.password) {
      return NextResponse.json({
        success: true,
        user: {
          id: 999,
          email: email,
          name: "Super Admin",
          role: "admin",
          address: "Endereço Secreto",
          phone: "00000000000",
          cpf: "000.000.000-00",
        },
      })
    }

    const usersPath = path.join(process.cwd(), "data", "users.json")
    const usersData = fs.readFileSync(usersPath, "utf8")
    const users = JSON.parse(usersData)

    // VULNERABILIDADE #1: Comparação de senha em texto plano
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      // VULNERABILIDADE #3: Retornando dados sensíveis
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          address: user.address, // Dado sensível exposto
          phone: user.phone, // Dado sensível exposto
          cpf: user.cpf, // Dado sensível exposto
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Credenciais inválidas",
        },
        { status: 401 },
      )
    }
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

// VULNERABILIDADE #8: CORS mal configurado (comentário explicativo)
/*
  CONFIGURAÇÃO INSEGURA DE CORS:
  Este endpoint deveria ter CORS restritivo, mas está configurado para aceitar
  requisições de qualquer origem, permitindo ataques cross-origin.
  
  Configuração insegura que deveria estar ativa:
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': '*'
  }
*/
