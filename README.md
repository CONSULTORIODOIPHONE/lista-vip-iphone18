# Lista VIP 2026 — Brunão do iPhone + Consultório do iPhone

Projeto estático para GitHub Pages com captação de leads em Google Sheets através de Google Apps Script.

## Arquivos

- `index.html` — página
- `style.css` — visual responsivo
- `script.js` — formulário + contador + integração
- `apps-script.gs` — backend que deve ser colado no Google Apps Script

## 1. Criar a planilha

1. Abra Google Sheets e crie uma planilha.
2. Nome sugerido: `Lista VIP iPhone 2026`.
3. Renomeie a primeira aba para exatamente: `Leads`.
4. Na linha 1, cole os cabeçalhos abaixo, um em cada coluna:

A: Data/Hora
B: Nome
C: WhatsApp
D: iPhone atual
E: Interesse
F: Upgrade
G: Momento
H: Pagamento
I: Origem
J: Temperatura
K: Vendedor
L: Status
M: Última interação
N: Observações
O: Consentimento
P: Página

Dica: congele a linha 1 e ative Filtro.

## 2. Criar o Apps Script

1. Com a planilha aberta: `Extensões > Apps Script`.
2. Apague o código existente.
3. Abra o arquivo `apps-script.gs` deste projeto.
4. Copie todo o código e cole no editor do Apps Script.
5. Clique em Salvar.

## 3. Publicar como Web App

No Apps Script:

1. Clique em `Implantar > Nova implantação`.
2. Clique na engrenagem e escolha `App da Web`.
3. Descrição: `Lista VIP iPhone`.
4. Executar como: `Eu`.
5. Quem pode acessar: escolha a opção que permita acesso público/qualquer pessoa disponível na sua conta.
6. Clique em `Implantar`.
7. Autorize o script quando o Google pedir.
8. Copie a URL final que termina em `/exec`.

IMPORTANTE: use a URL `/exec`, não a URL `/dev`.

## 4. Vincular o site

Abra `script.js`.

Troque:

const WEB_APP_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";

por:

const WEB_APP_URL = "https://script.google.com/macros/s/SEU_ID/exec";

Salve.

## 5. Testar antes de publicar

Abra a URL `/exec` no navegador. Ela deve mostrar uma resposta JSON parecida com:

{"ok":true,"service":"Lista VIP"}

Depois publique o site e faça um cadastro real.
Confira se uma nova linha apareceu na aba `Leads`.

## 6. Publicar no GitHub Pages

1. Crie um repositório no GitHub. Exemplo: `lista-vip-iphone-2026`.
2. Faça upload de:
   - index.html
   - style.css
   - script.js
3. Não é necessário subir `apps-script.gs`, mas você pode guardar no repositório se quiser.
4. Abra `Settings > Pages`.
5. Em `Build and deployment`, escolha `Deploy from a branch`.
6. Branch: `main`.
7. Pasta: `/(root)`.
8. Salve.

Seu endereço normalmente ficará:
`https://SEU-USUARIO.github.io/lista-vip-iphone-2026/`

## 7. Teste completo

1. Abra o site pelo celular.
2. Preencha o formulário.
3. Envie.
4. Veja a tela de confirmação.
5. Abra a planilha.
6. Confira se o lead apareceu.
7. Teste outro número.
8. Confira a classificação automática em `Temperatura`.

## Observação importante sobre o envio

O front-end usa `fetch(..., mode: "no-cors")` porque o site é hospedado em um domínio diferente do Google Apps Script. Isso torna o envio simples e evita bloqueios do navegador. Como consequência, o navegador não consegue ler a resposta final do Apps Script; por isso a tela considera o envio concluído se a requisição foi disparada sem erro de rede.

Para uso comercial mais robusto no futuro, o ideal é migrar o backend para Supabase/Firebase ou para uma API própria, onde é possível validar a resposta e adicionar autenticação/painel administrativo.

## Privacidade

A planilha contém telefone e interesse comercial de clientes.
- Não publique a planilha.
- Não coloque ID da planilha ou credenciais no JavaScript.
- Restrinja o acesso da planilha somente à equipe.
- O formulário já inclui consentimento de contato por WhatsApp.
