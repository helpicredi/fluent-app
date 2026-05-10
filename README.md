# 📱 Fluent — Learn English

App para praticar inglês diariamente com exercícios gerados por IA, streak de dias, níveis A1–C2 e múltiplos perfis.

---

## 🚀 Como publicar (passo a passo)

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde)
3. Nome: `fluent-app` (ou qualquer nome)
4. Deixe como **Public**
5. Clique em **"Create repository"**

### 2. Fazer upload dos arquivos
Na página do repositório recém-criado:
1. Clique em **"uploading an existing file"**
2. Arraste **todos os arquivos e pastas** desta pasta para lá
3. Clique em **"Commit changes"**

### 3. Ativar GitHub Pages
1. No repositório, clique em **Settings** (engrenagem)
2. No menu lateral, clique em **Pages**
3. Em **"Source"**, selecione **"GitHub Actions"**
4. Salve

### 4. Aguardar o deploy
- O GitHub vai construir o app automaticamente (~2 minutos)
- Aparecerá uma URL no formato: `https://SEU-USUARIO.github.io/fluent-app/`
- Acesse essa URL no celular — o app estará pronto!

### 5. Instalar no celular

**Android (Chrome):**
- Abra a URL no Chrome
- Aparecerá um banner "Instalar Fluent" na parte de cima
- Toque em **Instalar** → pronto, ícone na tela inicial!

**iPhone (Safari):**
- Abra a URL no Safari
- Toque no ícone compartilhar ↑
- Role e toque **"Adicionar à Tela de Início"**
- Toque em **Adicionar**

---

## ⚙️ Rodar localmente (opcional)

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.

---

## 🔑 Nota sobre a API

O app usa a API da Anthropic (Claude) para gerar exercícios. Ela funciona automaticamente quando acessado pelo Claude.ai. Se quiser usar de forma independente, adicione sua API key em `src/App.jsx` na função `generateExercise`.
