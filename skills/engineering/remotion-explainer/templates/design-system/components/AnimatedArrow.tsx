// src/design-system/components/AnimatedArrow.tsx
// Conector animado desenhado com evolvePath de @remotion/paths

import {useCurrentFrame, interpolate} from 'remotion';
import {evolvePath, getPathString} from '@remotion/paths';
import {COLORS, FONT_FAMILY, FONT_SIZE, SPACING} from '../tokens';
import {ELEMENT_ENTRY_FRAMES} from '../timing';

interface Point {
  x: number;
  y: number;
}

interface AnimatedArrowProps {
  from: Point;
  to: Point;
  label?: string;
  frameDuration?: number;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  from,
  to,
  label,
  frameDuration = ELEMENT_ENTRY_FRAMES,
}) => {
  const frame = useCurrentFrame();
  
  // Path base entre pontos
  const pathString = getPathString(from, to);
  
  // Evolução da stroke dash para animação de drawing
  const progress = interpolate(
    frame,
    [0, frameDuration],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const {strokeDasharray, strokeDashoffset} = evolvePath(progress);
  
  return (
    <g>
      {/* Arrow line */}
      <path
        d={pathString}
        stroke={COLORS.connector}
        strokeWidth={3}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={-strokeDashoffset}
        style={{transition: 'stroke-dashoffset 0.1s linear'}}
      />
      
      {/* Label if provided */}
      {label && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 20}
          textAnchor="middle"
          fontFamily={FONT_FAMILY.conceptSans}
          fontSize={FONT_SIZE.small}
          fill={COLORS.textSecondary}
          style={{pointerEvents: 'none'}}
        >
          {label}
        </text>
      )}
      
      {/* Arrowhead at destination */}
      <polygon
        points={`${to.x},${to.y - 6} ${to.x + 8},${to.y + 4} ${to.x - 8},${to.y + 4}`}
        fill={COLORS.connectorArrow}
        style={{opacity: interpolate(frame, [0, frameDuration], [0, 1])}}
      />
    </g>
  );
};

