// src/design-system/components/SplitComparison.tsx
// Comparação lado a lado antes/depois (antes em coluna esquerda, depois em direita)

import {useVideoConfig} from 'remotion';
import {SPACING, FONT_FAMILY, FONT_SIZE} from '../tokens';

interface SplitComparisonProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  ratio?: 2 / 3 | 1 / 2; // Proporção entre colunas
}

export const SplitComparison: React.FC<SplitComparisonProps> = ({
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
  ratio = 2 / 3, // Default mais espaço para conteúdo esquerdo
}) => {
  const {width} = useVideoConfig();
  
  // Calcular larguras das colunas com gap central
  const totalGap = SPACING.lg;
  const availableWidth = width - totalGap;
  
  const leftWidth = Math.floor(availableWidth * ratio);
  const rightWidth = availableWidth - leftWidth;
  
  return (
    <div style={{display: 'flex', gap: totalGap}}>
      {/* Coluna esquerda (antes) */}
      <div style={{flex: ratio, paddingRight: SPACING.md}}>
        <h3
          style={{
            fontFamily: FONT_FAMILY.conceptSans,
            fontSize: FONT_SIZE.label + 8,
            fontWeight: 700,
            marginBottom: SPACING.sm,
            color: COLORS.textPrimary,
          }}
        >
          {leftTitle}
        </h3>
        <div>{leftContent}</div>
      </div>
      
      {/* Coluna direita (depois) */}
      <div style={{flex: 1 - ratio, paddingLeft: SPACING.md}}>
        <h3
          style={{
            fontFamily: FONT_FAMILY.conceptSans,
            fontSize: FONT_SIZE.label + 8,
            fontWeight: 700,
            marginBottom: SPACING.sm,
            color: COLORS.textPrimary,
          }}
        >
          {rightTitle}
        </h3>
        <div>{rightContent}</div>
      </div>
    </div>
  );
};

