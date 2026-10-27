// src/design-system/tokens.ts
// Tokens de design system para animações explicativas no Remotion
// Nenhuma cena deve usar cores/tamanhos literais fora deste arquivo

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

export const BORDER_RADIUS = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
  full: 9999, // círculos completos
} as const;

export const SHADOWS = {
  elevation1: '0 1px 3px rgba(0,0,0,0.3)',     // leve levitação
  elevation2: '0 4px 8px rgba(0,0,0,0.4)',     // médio destaque
  elevation3: '0 8px 16px rgba(0,0,0,0.5)',    // alto destaque (usar pouco)
} as const;

export const RATIOS = {
  cardAspectRatio: 16 / 9,      // cards principais
  columnSplitLeft: 2 / 3,       // layout comparação: 2/3 esquerda, 1/3 direita
  columnSplitRight: 1 / 3,
  elementSpacingRatio: 1 / 4,   // gap entre elementos adjacentes = 1/4 largura elemento
} as const;

// Export styles ready-to-use
export const typographyStyles = {
  labelText: {
    fontFamily: FONT_FAMILY.conceptSans,
    fontSize: FONT_SIZE.label,
    fontWeight: FONT_WEIGHT.semiBold as any,
    lineHeight: FONT_SIZE.label * 1.4,
    letterSpacing: 0,
    color: COLORS.textPrimary,
  } as React.CSSProperties,
  bodyText: {
    fontFamily: FONT_FAMILY.conceptSans,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.regular as any,
    lineHeight: FONT_SIZE.body * 1.4,
    letterSpacing: 0,
    color: COLORS.textPrimary,
  } as React.CSSProperties,
  codeBlock: {
    fontFamily: FONT_FAMILY.codeMono,
    fontSize: FONT_SIZE.code,
    fontWeight: FONT_WEIGHT.regular as any,
    lineHeight: FONT_SIZE.code * 1.4,
    letterSpacing: 0.05,
    color: COLORS.textSecondary,
  } as React.CSSProperties,
} as const;

