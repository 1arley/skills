// src/design-system/components/Callout.tsx
// Anotador com seta apontando para elemento específico

import {useCurrentFrame, interpolate} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS, SPACING} from '../tokens';
import {ELEMENT_ENTRY_FRAMES} from '../timing';

interface CalloutTarget {
  x: number;
  y: number;
  label: string;
  description: string;
}

interface CalloutProps {
  target: CalloutTarget;
  triggerFrame?: number;
}

export const Callout: React.FC<CalloutProps> = ({target, triggerFrame = 0}) => {
  const frame = useCurrentFrame();
  
  // Aparece depois de triggerFrame com stagger
  if (frame < triggerFrame) return null;
  
  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + ELEMENT_ENTRY_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + ELEMENT_ENTRY_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  // Posição da caixa de texto (offset da direita do alvo)
  const boxX = target.x + 40;
  const boxY = target.y - 30;
  
  // Ponto final da seta (no canto inferior esquerdo da caixa)
  const arrowEndX = boxX - 10;
  const arrowEndY = boxY + 20;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Arrow path */}
      <line
        x1={arrowEndX}
        y1={arrowEndY}
        x2={target.x}
        y2={target.y}
        stroke={COLORS.connector}
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        style={{opacity}}
      />
      
      {/* Callout box */}
      <g style={{opacity}}>
        <rect
          x={boxX}
          y={boxY}
          width={220}
          height={70}
          rx={BORDER_RADIUS.small}
          fill={COLORS.surfaceElevated}
          stroke={COLORS.borderStrong}
          strokeWidth={1}
        />
        
        {/* Label text */}
        <text
          x={boxX + 12}
          y={boxY + 22}
          fontFamily={FONT_FAMILY.conceptSans}
          fontSize={FONT_SIZE.label}
          fontWeight={600}
          fill={COLORS.textPrimary}
        >
          {target.label}
        </text>
        
        {/* Description text */}
        <text
          x={boxX + 12}
          y={boxY + 45}
          fontFamily={FONT_FAMILY.conceptSans}
          fontSize={14}
          fill={COLORS.textSecondary}
          width={190}
        >
          {target.description}
        </text>
      </g>
      
      {/* Arrowhead marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.connector} />
        </marker>
      </defs>
    </svg>
  );
};

