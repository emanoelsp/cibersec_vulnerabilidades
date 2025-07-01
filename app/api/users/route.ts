import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// VULNERABILIDADE #6: API exposta sem autenticação
export async function GET(request: NextRequest) {
  try {
    // Sem verificação de autenticação ou autorização!
    // Qualquer pessoa pode acessar dados de todos os usuários

    const usersPath = path.join(process.cwd(), "data", "users.json")
    const usersData = fs.readFileSync(usersPath, "utf8")
    const users = JSON.parse(usersData)

    // VULNERABILIDADE #3: Retornando dados sensíveis (senhas, CPF, etc.)
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar usuários" }, { status: 500 })
  }
}
