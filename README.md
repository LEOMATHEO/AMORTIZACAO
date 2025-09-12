# Controle de Financiamento — PWA (GitHub Pages)

PWA instalável no celular e que funciona offline. Publica direto no **GitHub Pages** (sem build).

## Publicar no GitHub Pages
1. Crie um repo (ex.: `controle-financiamento`).
2. Envie **todos os arquivos** deste ZIP para a raiz do repo.
3. Em **Settings → Pages**:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. O app vai abrir em: `https://SEU_USUARIO.github.io/controle-financiamento/`

## Instalar no celular
- Android (Chrome): abrir o link → menu ⋮ → **Adicionar à tela inicial**.
- iOS (Safari): compartilhar → **Adicionar à Tela de Início**.

## Observações
- **Sugerido (TOTAL)** = Parcela + Extra necessário para quitar em M meses.
- Aproximação: `i_eff ≈ juros_mensal + índice_mensal`.
- Funciona 100% offline após o primeiro acesso (service worker + cache).

## Trocar ícones
Substitua `icons/icon-192.png` e `icons/icon-512.png` pelos seus ícones (PNG).
