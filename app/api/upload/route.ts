import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// VULNERABILIDADE #10: Upload de arquivos sem validação
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // VULNERABILIDADE: Sem validação de tipo de arquivo
    // Aceita qualquer tipo de arquivo, incluindo executáveis e scripts

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // VULNERABILIDADE: Salva arquivo com nome original (path traversal possível)
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, file.name)
    fs.writeFileSync(filePath, buffer)

    // VULNERABILIDADE: Retorna caminho do arquivo que pode ser executado
    return NextResponse.json({
      success: true,
      url: `/uploads/${file.name}`,
      message: `Arquivo ${file.name} enviado com sucesso (sem validação de segurança)`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 })
  }
}
