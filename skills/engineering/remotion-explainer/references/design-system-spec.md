# Especificação do Design System

Esta documentação define a especificação completa do design system para animações Remotion explicativas. O sistema é modular e reutilizável entre projetos.

## Tokens de Cores (src/design-system/tokens.ts)

### Paleta semântica

Todas as cores vêm de exportações nomeadas, nunca literais hexadecimais nas cenas.

```typescript
// src/design-system/tokens.ts
export const COLORS = {
  // Fundo - camadas profundas da hierarquia visual
  backgroundDeep: '#0d0d1a',     // mais profundo, atrás de tudo
  surfaceCard: '#1a1a2e',        // cards, containers primários
  surfaceElevated: '#252542',    // elementos levantados (elevação +1)
  
  // Estados funcionais
  idle: '#5867f0',              // estado normal/inativo (azul padrão)
  active: '#64b6f7',            // elemento ativo em movimento principal
  success: '#4ade80',           // completado/sucesso/bom
  warning: '#fbbf24',           // alerta/atenção/caution
  error: '#f87171',             // erro/falha/ruim
  
  // Foco e destaque
  focus: '#ffffff',             // texto destacado/anotação ativa
  dim: 'rgba(255,255,255,0.3)', // opacidade reduzida para FocusDim
  
  // Tipografia
  textPrimary: '#ffffff',       // textos principais ≥36px
  textSecondary: '#a1a1aa',     // textos secundários 24-28px
  textMuted: '#52525b',         // textos muito secundários ≤20px (evitar)
  
  // Bordas e conectores
  borderSubtle: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.2)',
  connector: '#64b6f7',         // setas/linhas conectando elementos
  connectorArrow: '#ffffff',    // pontas de seta (se diferentes)
} as const;
```

### Regras de uso das cores

1. **Significado fixo**: cada cor tem significado semântico documentado e consistente:
   - Azul (`idle`): elementos novos aparecendo pela primeira vez
   - Azul claro (`active`): elemento em transformação/movimento principal
   - Verde (`success`): estados alcançados, caminhos concluídos
   - Laranja (`warning`): pontos de atenção, transformações complexas
   - Vermelho (`error`): falhas, caminhos inválidos, blocos
   - Branco (`focus`): elementos destacados quando outros estão `dim`

2. **Máximo três cores de destaque por cena**: escolher máximo de 3 cores além de branco/cinza neutros. Exemplo aceito: azul+verde+laranja = novo+mudança/completo=alerta. Nunca usar todas cinco simultaneamente.

3. **Contraste mínimo**: verificar com calculadora WCAG:
   - Texto sobre superfície: ≥4,5:1 para normal weight, ≥7:1 para thin/light weight
   - Conectores sobre fundo: ≥3:1 para linha fina, ≥4,5:1 se também transmitir informação textual
   - Borders contra superfícies: ≥2,5:1 apenas decorativo, ≥4,5:1 se indicar borda funcional

4. **Gradientes proibidos**: não usar gradientes suaves entre cores. Apenas sólidas ou animações passo-a-passo (mudança de classe CSS).

### Valores medidos de referências

Para cada referência visual fornecida pelo usuário, extrair e registrar:

| Elemento | Medição | Aplicação no design system |
|----------|---------|----------------------------|
| Hierarquia espacial | Distância título→subtítulo: 48px; colunas gap: 32px | Definir spacing vertical 8×n, horizontal gaps padronizados |
| Proporções elementos | Card ocupa 60% viewport, sidebar 40% | Grid 2/3 + 1/3, manter ratio fixo em qualquer tamanho |
| Espessura setas | Stroke: 2px para normal, 3px para ênfase | Connector strokeWidth: 2px base, 3px emphasis |
| Densidade texto | 60-80 palavras por 1920×1080 scene | Máximo 4 bullets, cada ≤12 palavras, total ≤40 palavras |
| Contraste fundo | Valor luminância: #0d0d1a (L*=3,4), white L*=98 | Manter ΔL≥85 entre texto principal e background |

Exemplo de anotação de referência:

```markdown
**Referência: diagrama arquitetura AWS (screenshot.png)**

Medido:
- Cards ocupam 40% width cada, gap horizontal 48px
- Setas com stroke-width 2px, arrowhead size 12px
- Font-family: Inter (sans geometric), weights 400 regular / 600 semi-bold
- Label font-size 28px, body 36px
- Background dark (#111122), card lighter (#1a1a33)
- Delta luminance text/background: 89 units → OK (≥85 necessário)

Ação:
- Adicionar ao DECISIONS.md: "espessura seta 2px baseada em referência AWS"
- Importar Inter via @remotion/google-fonts/Inter
- Ajustar COLOR.backgroundDeep para #111122
- Registrar premissa: "fontes escolhidas conforme referência AWS"
```

## Tipografia

### Fontes propostass

Escolher duas fontes apenas: uma geométrica sans-serif para conceitos/narrativa, uma monoespaçada para código/registros/caminhos técnicos.

```typescript
// src/design-system/tokens.ts (continuação)
export const FONT_FAMILY = {
  conceptSans: 'Inter, sans-serif',    // títulos, labels, explicações conceituais
  codeMono: 'JetBrains Mono, monospace', // código, registradores, paths, IDs técnicos
} as const;

export const FONT_SIZE = {
  label: 28,        // rótulos curtos (1-4 palavras)
  body: 36,         // corpo de texto principal
  code: 30,         // código/blocks técnicos
  small: 24,        // notas rodapé, informações secundárias (usar raramente)
  min: 24,          // limite absoluto inferior (nunca abaixo disso)
} as const;

export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;
```

### Regras de aplicação tipográfica

1. **Hierarquia clara**: tamanho indica importância. Corpo > Rótulo > Código > Small. Nunca escalar arbitrariamente.

2. **Peso limitado**: máximo dois pesos distintos por cena (ex: regular + medium para contraste, não regular/medium/bold juntos).

3. **Line-height calculada**: sempre 1,4-1,5 × fonte para textos com múltiplas linhas. Exemplo: 36px → line-height 54px.

4. **Letter-spacing**: 0 para Sans-serif, 0,05em para Monospace (melhora legibilidade de caracteres estreitos).

5. **Loading garantido**: esperar fonts carregarem antes renderizar texto usando delayRender() conforme loadFont().waitUntilDone().

### Importação de fontes

```typescript
// src/fonts.ts
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {
  weights: [400, 500, 600],
  subsets: ['latin'],
});

const jetBrainsMono = loadJetBrainsMono('normal', {
  weights: [400, 600],
  subsets: ['latin'],
});

export const waitForFonts = async () => {
  await Promise.all([inter.waitUntilDone(), jetBrainsMono.waitUntilDone()]);
};

export const typographyStyles = {
  labelText: {
    fontFamily: inter.fontFamily,
    fontSize: FONT_SIZE.label,
    fontWeight: FONT_WEIGHT.semiBold as any,
    lineHeight: FONT_SIZE.label * 1.4,
    letterSpacing: 0,
  } as React.CSSProperties,
  // ... outros styles
};
```

## Espaçamento e Grid

### Sistema baseado em 8 pixels

Todos os espaçamentos são múltiplos inteiros de 8px:

```typescript
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  marginSafe: 96,   // margem de segurança obrigatória nos 4 lados da viewport
} as const;

export function gap(n: number): number {
  return n * SPACING.sm; // conveniência: gap(n) = n*16px
}
```

### Margem de segurança

Nenhum elemento importante cruza margem de segurança 96px em todos os lados. Isso garante:

- Nenhum corte em TVs modernas que aplicam overscan
- Espaço seguro para overlays de UI durante reprodução
- Compatibilidade com mobile/tablet sem esmagamento

Verificação manual: abrir cada still na auditoria e desenhar retângulo interno 1920-192×1080-192 = 1728×888. Todos os elementos críticos dentro desse retângulo.

### Grid padrão

Composição 1920×1080 divide em grid invisível opcional:

- Vertical: 12 columns × 160px cada (12 × 160 = 1920)
- Horizontal: 8 rows × 135px cada (8 × 135 ≈ 1080, arredondado)

Usar grid para alinhar elementos, mas não revelar grid visualmente. Aplicar padding automático baseado em SPACING.marginSafe antes posicionar no grid.

### Proporções entre elementos

Definir ratios fixos para consistência:

```typescript
export const RATIOS = {
  cardAspectRatio: 16 / 9,      // cards principais
  columnSplitLeft: 2 / 3,       // layout comparação: 2/3 esquerda, 1/3 direita
  columnSplitRight: 1 / 3,
  elementSpacingRatio: 1 / 4,   // gap entre elementos adjacentes = 1/4 largura elemento
} as const;
```

## Raios e Sombras

### Border radius

```typescript
export const BORDER_RADIUS = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
  full: 9999, // círculos completos
} as const;

// Recomendações:
// - Cards: large (16px) ou medium (8px) se densidade alta
// - Buttons: medium (8px)
// - Icons: full (círculos)
// - Labels pequenos: small (4px) ou none
```

### Elevation e shadows

Sombras suaves para indicar elevação, nunca hard drop shadows dramáticas:

```typescript
export const SHADOWS = {
  elevation1: '0 1px 3px rgba(0,0,0,0.3)',     // leve levitação
  elevation2: '0 4px 8px rgba(0,0,0,0.4)',     // médio destaque
  elevation3: '0 8px 16px rgba(0,0,0,0.5)',    // alto destaque (usar pouco)
} as const;

// Usar sombras apenas quando elemento sobrepõe outro. Evitar em backgrounds profundos onde sombra se perde.
```

## Springs de Animação (src/design-system/springs.ts)

### Presets definidos

Configurar três presets de molas cobrindo necessidades comuns:

```typescript
// src/design-system/springs.ts
import {spring, type SpringConfig} from 'remotion';

export const SPRING_SNAPPY: SpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
  overshootClamping: false,
};

export const SPRING_SMOOTH: SpringConfig = {
  damping: 200,
  stiffness: 200,
  mass: 1,
  overshootClamping: true,
};

export const SPRING_BOUNCY: SpringConfig = {
  damping: 8,
  stiffness: 150,
  mass: 0.5,
  overshootClamping: false,
};

// Uso:
// spring({ frame, fps, config: SPRING_SNAPPY }) → interface elements rápidas, decisivas
// spring({ frame, fps, config: SPRING_SMOOTH }) → transições suaves, mudanças de estado
// spring({ frame, fps, config: SPRING_BOUNCY }) → celebrações, sucesso, feedback positivo
```

### Quando usar cada preset

| Cenário | Preset recomendado | Justificativa |
|---------|-------------------|---------------|
| Botão clicado | SNAPPY | Feedback imediato, sensação tátil realista |
| Elemento entrando | SMOOTH | Progressivo, não agressivo |
| Estado mudando (idle→active) | SNAPPY | Transição clara, rápida |
| Highlight/aparecer | BOUNCY | Leve rebote indica "algo bom aconteceu" |
| Fade-in/out suave | SMOOTH | Opacidade transiciona naturalmente |
| Conexões desenhando | SMOOTH | evolvePath deve fluir uniformemente |

### Valores finais no DECISIONS.md

Sempre atualizar DECISIONS.md com valores usados:

```markdown
## Física e timing

| Preset | damping | stiffness | mass | Onde foi usado |
|--------|---------|-----------|------|----------------|
| SNAPPY | 20 | 200 | 0.8 | NodeBox state transition |
| SMOOTH | 200 | 200 | 1 | AnimatedArrow path drawing |
| BOUNCY | 8 | 150 | 0.5 | Success badge appearance |

Entrada de elemento: 0,6s · Stagger: 0,2s · Antecipação (LEAD): 0,12s · Tempo mínimo de leitura: max(1,2s, palavras÷3,5)
```

## Componentes Base (src/design-system/components/)

Implementar componentes Reatônicos reutilizáveis consumindo exclusivamente tokens. Cada componente é um bloco atômico de construção.

### NodeBox

Caixa representando um conceito/elemento técnico com estados idle/active/error/success.

```typescript
// NodeBox.tsx
interface NodeBoxProps {
  state?: 'idle' | 'active' | 'success' | 'error';
  label?: string;
  style?: React.CSSProperties;
}

export const NodeBox: React.FC<NodeBoxProps> = ({state = 'idle', label, style}) => {
  const frame = useCurrentFrame();
  const {COLORS, FONT_FAMILY, FONT_SIZE} = tokens;
  
  const backgroundColor = interpolate(frame, [0, 18], 
    [COLORS.surfaceCard, COLORS[`${state}Color`]], 
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  
  const opacity = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp'});
  
  return (
    <div
      style={{
        backgroundColor,
        opacity,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.md,
        ...style,
      }}
    >
      {label && <span style={{...typographyStyles.labelText}}>{label}</span>}
    </div>
  );
};
```

### AnimatedArrow

Conector animado desenhado com evolvePath(@remotion/paths).

```typescript
// AnimatedArrow.tsx
interface AnimatedArrowProps {
  from: {x: number; y: number};
  to: {x: number; y: number};
  label?: string;
  frameDuration?: number;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({from, to, label, frameDuration = 24}) => {
  const frame = useCurrentFrame();
  const length = getLength(getPathString(from, to));
  
  const {strokeDasharray, strokeDashoffset} = evolvePath(
    interpolate(frame, [0, frameDuration], [0, 1], {extrapolateLeft: 'clamp'})
  );
  
  return (
    <g>
      <path
        d={getPathString(from, to)}
        stroke={COLORS.connector}
        strokeWidth={2}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
      {label && (
        <text x={(from.x + to.x)/2} y={(from.y + to.y)/2}>
          {label}
        </text>
      )}
    </g>
  );
};
```

### StateBadge

Badge indicando estado de um elemento (idle/active/success/warning/error).

```typescript
// StateBadge.tsx
interface StateBadgeProps {
  state: 'idle' | 'active' | 'success' | 'warning' | 'error';
}

export const StateBadge: React.FC<StateBadgeProps> = ({state}) => {
  const {COLORS, BORDER_RADIUS} = tokens;
  
  return (
    <div
      style={{
        backgroundColor: COLORS[state],
        borderRadius: BORDER_RADIUS.full,
        width: 16,
        height: 16,
      }}
    />
  );
};
```

### SplitComparison

Comparação lado a lado antes/depois (antes em coluna esquerda, depois em direita).

```typescript
// SplitComparison.tsx
interface SplitComparisonProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const SplitComparison: React.FC<SplitComparisonProps> = ({leftTitle, rightTitle, leftContent, rightContent}) => {
  const {SPACING, FONT_FAMILY} = tokens;
  
  return (
    <div style={{display: 'flex', gap: SPAGING.lg}}>
      <div style={{flex: 2}}> {/* 2/3 width */}
        <h3 style={{fontFamily: FONT_FAMILY.conceptSans}}>{leftTitle}</h3>
        {leftContent}
      </div>
      <div style={{flex: 1}}> {/* 1/3 width */}
        <h3 style={{fontFamily: FONT_FAMILY.conceptSans}}>{rightTitle}</h3>
        {rightContent}
      </div>
    </div>
  );
};
```

### FocusDim

Redutora de opacidade para destacar elemento específico enquanto diminui visibilidade dos demais.

```typescript
// FocusDim.tsx
interface FocusDimProps {
  children: React.ReactNode;
  focusedId: string;
  allIds: readonly string[];
  dimOpacity?: number;
}

export const FocusDim: React.FC<FocusDimProps> = ({children, focusedId, allIds, dimOpacity = 0.3}) => {
  const frame = useCurrentFrame();
  const {COLORS} = tokens;
  
  return (
    <>
      {React.Children.map(children, (child, index) => {
        const id = allIds[index];
        const opacity = id === focusedId ? 1 : dimOpacity;
        return (
          <div key={id} style={{opacity, transition: 'opacity 0.3s'}}>
            {child}
          </div>
        );
      })}
    </>
  );
};
```

### Callout

Anotador com seta apontando para elemento específico.

```typescript
// Callout.tsx
interface CalloutProps {
  text: string;
  targetX: number;
  targetY: number;
}

export const Callout: React.FC<CalloutProps> = ({text, targetX, targetY}) => {
  // Implementar triangulo/seta apontando para (targetX, targetY)
  // Usar path evolution para conectar callout box ao target
  return null; // stub
};
```

### CodeBlock

Bloco estilizado para exibir código/snippets com fonte monoespaçada.

```typescript
// CodeBlock.tsx
interface CodeBlockProps {
  code: string;
  language?: 'typescript' | 'javascript' | 'bash' | 'json';
  highlightLines?: number[];
}

export const CodeBlock: React.FC<CodeBlockProps> = ({code, language, highlightLines}) => {
  const {FONT_FAMILY, BORDER_RADIUS} = tokens;
  
  return (
    <pre
      style={{
        fontFamily: FONT_FAMILY.codeMono,
        fontSize: FONT_SIZE.code,
        borderRadius: BORDER_RADIUS.medium,
        backgroundColor: COLORS.surfaceCard,
        padding: SPACING.md,
        overflowX: 'auto',
      }}
    >
      <code>{code}</code>
    </pre>
  );
};
```

### Cursor

Cursor customizado seguindo movimento mouse (ou frame-based animation path).

```typescript
// Cursor.tsx
interface CursorProps {
  path?: Array<{x: number; y: number}>;
  onClickAnimation?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({path, onClickAnimation}) => {
  // Implementar círculo follow baseado em mouse position ou frame interpolation do path array
  return null; // stub
};
```

## Verificação de conformidade

Antes de prosseguir para próxima etapa, validar:

### Grep de cores hexadecimais

```bash
grep -rnE "#[0-9a-fA-F]{3,8}" src/scenes
```

**Resultado esperado**: vazio (nenhum literal hexadecimal encontrado). Se encontrar, extrair para tokens.ts imediatamente.

### Teste de legibilidade visual

Abrir cada still na auditoria e confirmar:

- [ ] Corpo ≥36px (verificar inspector browser)
- [ ] Rótulos ≥28px
- [ ] Código ≥30px
- [ ] Mínimo 24px (não há nada menor)
- [ ] Três cores de destaque no máximo
- [ ] Textos dentro margem segura 96px
- [ ] Gap entre elementos ≥SPACING.sm (16px)
- [ ] Borders consistentes (mesmo thickness em todo lugar)

### Checklist de tokens

Confirmar todos os seguintes imports vindos de design system:

- [ ] `import {COLORS} from '../design-system/tokens'`
- [ ] `import {SPACING} from '../design-system/tokens'`
- [ ] `import {FONT_FAMILY, FONT_SIZE} from '../design-system/tokens'`
- [ ] `import {BORDER_RADIUS, SHADOWS} from '../design-system/tokens'`
- [ ] `import {SPRING_SNAPPY, SPRING_SMOOTH, SPRING_BOUNCY} from '../design-system/springs'`
- [ ] `import {NodeBox, AnimatedArrow, StateBadge, ...} from '../design-system/components'`
- [ ] Nenhuma importação direta de hexadecimais
- [ ] Nenhuma importação de valores numéricos arbitrários

Se qualquer item negativamente, corrigir antes de pedir checkpoint.

