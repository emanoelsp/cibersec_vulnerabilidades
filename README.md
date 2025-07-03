# 🛒 E-Commerce Security Lab

## 📚 Objetivo Educacional

Esta aplicação foi desenvolvida especificamente para a disciplina **"Fundamentos da Segurança da Informação"** como uma ferramenta prática de aprendizado. O sistema simula um e-commerce funcional, mas contém **10 vulnerabilidades de segurança intencionais** que devem ser identificadas e documentadas pelos alunos.

## 🚀 Como Executar o Projeto

1. Clone o repositório
2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
3. Execute o projeto em modo de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Acesse \`http://localhost:3000\`

## 🎯 Funcionalidades do Sistema

- ✅ Sistema de login e registro
- ✅ Catálogo de produtos com busca
- ✅ Carrinho de compras
- ✅ Processo de checkout
- ✅ Painel administrativo
- ✅ Sistema de avaliações de produtos
- ✅ Histórico de pedidos

## 🔍 Desafios de Segurança (10 Vulnerabilidades)

Os alunos devem navegar pelo sistema e identificar as seguintes vulnerabilidades:

1. **Falha de Autenticação** - Credenciais fracas e armazenamento inseguro
2. **Cross-Site Scripting (XSS)** - Execução de scripts maliciosos
3. **Exposição de Dados Sensíveis** - Informações confidenciais visíveis no cliente
4. **Quebra de Controle de Acesso** - Acesso não autorizado a funcionalidades
5. **Injeção via Parâmetros** - Manipulação de dados através da URL
6. **Falha de Autorização em APIs** - Endpoints desprotegidos
7. **Credenciais Hardcoded** - Senhas e chaves expostas no código
8. **Configuração de Segurança Inadequada** - CORS e outras configurações
9. **Falta de Criptografia em Trânsito** - Dados transmitidos sem proteção
10. **Upload Inseguro de Arquivos** - Validação inadequada de uploads

## 📝 Instruções para os Alunos

1. Explore todas as funcionalidades do sistema
2. Tente diferentes tipos de entrada nos formulários
3. Analise o código-fonte em busca de vulnerabilidades
4. Teste diferentes cenários de uso
5. Documente cada vulnerabilidade encontrada com:
   - Descrição da falha
   - Como reproduzir
   - Impacto potencial
   - Sugestão de correção

## ⚠️ Aviso Importante

Esta aplicação contém vulnerabilidades intencionais e **NÃO deve ser usada em produção**. É destinada exclusivamente para fins educacionais em ambiente controlado.

## 🛠️ Tecnologias Utilizadas

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Armazenamento local em JSON
