# google-sheets-db

## 🚀 Projeto
Protótipo de uma base de dados a partir de uma Planilha Google. Grátis, rápido, perfeito para visualização de protótipos de apps web antes do desenvolvimento do servidor backend do projeto.</br>
(Solução não eficiente em termos de velocidade, e não escalável para deploy de projetos de grande porte. Mas perfeito para protótipos de apps!)

## 🛠️ Tecnologias
- [Google Planilhas](https://workspace.google.com/intl/pt-BR/products/sheets/)
- [Google Apps Script](https://www.google.com/script/start/)

## 🗂️ Utilização

- Crie um novo arquivo no [Google Planilhas](https://workspace.google.com/intl/pt-BR/products/sheets/). Complete a primeira linha de cabeçalho com os nomes das colunas (Ex.:<code>"id"</code>, <code>"name"</code>, <code>"description"</code>), e nomeie a "página" com o nome relativo a tabela no banco de dados (<code>"products"</code>, por ex). <div align="center"><img width="80%" alt="google sheets print" src="/github_assets/google-sheet.png" /></div>
- No menu de Extensões, selecione a opção "Apps Script".
- Cole o código do arquivo <code>[Código.gs](https://github.com/Alessandro1918/google-sheets-db/blob/main/Código.gs)</code> desse repositório.
- Clique no botão "Implantar", e selecione a opção "Nova implantação".
- Complete os detalhes da implantação:
  - Tipo de implantação: App da Web
  - Descrição: insira uma descrição
  - Executar como: selecione seu usuário da conta Google
  - Quem pode acessar: Qualquer pessoa
  - Clique em "Implantar" e aguarde alguns instantes.
  - Autorize o projeto (App Script) a acessar documentos da sua conta (Google Planilhas)
  - Copie o "código da implantação. Ele será a URL de base para acesso a sua API (ponto de acesso para sua base de dados).</br> Ex.: <code>https://script.google.com/macros/s/AKfyc...lS-nQ/exec</code>
- Teste a implantação:
  - Siga esse endereço buscando essa URL no seu navegador de internet.
  - No primeiro acceso, será necessário confirmar ter autorização para executar essa ação. Siga as instruções do email recebido na sua conta Google.
  - Após confirmar o acesso, teste novamente. Siga o endereço <code>https://script.google.com/macros/s/AKfyc...lS-nQ/exec?sheet=products</code> (onde <code>"sheet="</code> deve ser completado com o nome da sua aba / tabela. No exemplo, <code>"products"</code>).
- Confira o conteúdo da sua tabela em JSON no retorno da requisição!
```json
[
  {
    "id":1,
    "name":"TV",
    "brand":"LG",
    "price":1000,
    "description":"TV LG 55'' Ultra HD",
  },
  {...},
  {...}
]
```

### 💻 Rotas HTTP:
#### baseURL: <code>https://script.google.com/macros/s/AKfyc...lS-nQ/exec</code>

- Listar todos os resultados:
```
GET baseURL?sheet=products
```
