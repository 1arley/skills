// src/design-system/components/NodeBox.tsx
// Caixa representando um conceito/elemento técnico com estados idle/active/error/success

import {useCurrentFrame, interpolate} from 'remotion';
import type {SpringConfig} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS, SPACING, typographyStyles} from '../tokens';
import {SPRING_SNAPPY, SPRING_SMOOTH} from '../springs';
import {ELEMENT_ENTRY_FRAMES} from '../timing';

interface NodeBoxProps {
  state?: 'idle' | 'active' | 'success' | 'warning' | 'error';
  label: string;
  style?: React.CSSProperties;
  springConfig?: SpringConfig;
}

export const NodeBox: React.FC<NodeBoxProps> = ({
  state = 'idle',
  label,
  style,
  springConfig = SPRING_SNAPPY,
}) => {
  const frame = useCurrentFrame();
  
  // Cor de fundo baseada no estado
  const backgroundColor = interpolate(
    frame,
    [0, ELEMENT_ENTRY_FRAMES],
    [COLORS.surfaceCard, COLORS[state + (state === 'idle' ? '' : 'Color') as keyof typeof COLORS]],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  // Opacidade de entrada suave
  const opacity = interpolate(
    frame,
    [0, ELEMENT_ENTRY_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  // Escala de entrada (levemente crescendo)
  const scale = interpolate(
    frame,
    [0, ELEMENT_ENTRY_FRAMES],
    [0.95, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  return (
    <div
      style={{
        backgroundColor,
        opacity,
        transform: `scale(${scale})`,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.md,
        ...typographyStyles.bodyText,
        ...style,
      }}
    >
      <span style={{fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.semiBold}}>{label}</span>
    </div>
  );
};

