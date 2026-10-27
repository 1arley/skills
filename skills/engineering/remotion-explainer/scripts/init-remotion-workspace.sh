#!/bin/bash
# scripts/init-remotion-workspace.sh
# Bootstrap completo para workspace Remotion: pacotes, skills oficiais e Studio

set -e  # Exit immediately on error

echo "🚀 Iniciando workspace Remotion..."
echo "=================================="

# Configurações
REMOOTION_VERSION="4.0.539"
TARGET_DIR="${1:-.}"  # Default: current directory

cd "$TARGET_DIR"

# Passo 1: Verificar Node.js
echo ""
echo "📦 Verificando dependências..."

node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
  echo "❌ ERRO: Node.js versão $node_version detectada. Requer Node ≥ 16."
  echo "   Instale Node 16 ou superior em https://nodejs.org/"
  exit 1
fi

echo "✅ Node.js $node_version.x (≥ 16 requerido)"

# Passo 2: Criar package.json se não existir
if [ ! -f "package.json" ]; then
  echo ""
  echo "📝 Criando package.json..."
  cat > package.json <<EOF
{
  "name": "remotion-explainer-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion render Master out/master.mp4 --muted",
    "render-preview": "remotion render Master out/preview.mp4 --scale=0.5 --crf=28"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF
else
  echo "ℹ️  package.json já existente (atuizando dependências Remotion)"
fi

# Passo 3: Instalar pacotes Remotion na mesma versão exata (sem caret!)
echo ""
echo "📦 Instalando pacotes Remotion v$REMOOTION_VERSION..."

npm install --save \
  remotion@$REMOOTION_VERSION \
  @remotion/cli@$REMOOTION_VERSION \
  @remotion/transitions@$REMOOTION_VERSION \
  @remotion/paths@$REMOOTION_VERSION \
  @remotion/shapes@$REMOOTION_VERSION \
  @remotion/google-fonts@$REMOOTION_VERSION \
  @remotion/media-utils@$REMOOTION_VERSION \
  @remotion/install-whisper-cpp@$REMOOTION_VERSION \
  @remotion/bundler@$REMOOTION_VERSION \
  @remotion/studio@$REMOOTION_VERSION \
  @remotion/eslint-plugin@$REMOOTION_VERSION \
  lucide-react@latest || {
  echo "❌ Falha ao instalar pacotes. Verifique conexão e tente novamente."
  exit 1
}

echo "✅ Pacotes instalados com sucesso!"

# Passo 4: Instalar ESLint plugin e configurar
echo ""
echo "⚙️  Configurando ESLint..."

npm install --save-dev eslint@^8.50.0 eslint-config-prettier@^9.0.0 prettier@^3.0.0 || true

cat > .eslintrc.json <<EOF
{
  "extends": ["plugin:@remotion/recommended"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
EOF

# Passo 5: Configurar TypeScript
if [ ! -f "tsconfig.json" ]; then
  echo ""
  echo "📝 Criando tsconfig.json..."
  cat > tsconfig.json <<EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
EOF
fi

# Passo 6: Criar estrutura de diretórios src
echo ""
echo "📁 Criando estrutura de diretórios..."

mkdir -p src/{design-system/components,beats,scenes} public

# Passo 7: Iniciar Remotion Studio em background (ou avisar usuário)
echo ""
echo "🎬 Pronto! Para iniciar o Remotion Studio:"
echo "   npm run dev"
echo ""
echo "   Ou executar manualmente:"
echo "   npx remotion studio"
echo ""
echo "O Studio abrirá em http://localhost:3000"
echo ""

# Passo 8: Instalar Remotion Skills (opcional para agentes)
echo "🤖 Instalando skills oficiais do Remotion..."
npx remotion skills add 2>/dev/null || echo "⚠️  Skills installation may require interactive mode - skip for now"

echo ""
echo "✅ Workspace pronto! Estrutura criada:"
echo "   src/design-system/components/  → Tokens e componentes base"
echo "   src/beats/                     → Cenas beat por beat"
echo "   public/                        → Assets (audio, imagens)"
echo ""
echo "Próximos passos:"
echo "1. Abra o Studio: npm run dev"
echo "2. Implemente PilotComposition.tsx (etapa 2)"
echo "3. Valide com npx tsc --noEmit"
echo ""
echo "Dica: Consulte references/workflow-checkpoints.md para critérios de aceite por etapa."

