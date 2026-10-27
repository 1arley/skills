// src/design-system/components/StateBadge.tsx
// Badge indicando estado de um elemento (idle/active/success/warning/error)

import {useCurrentFrame, interpolate} from 'remotion';
import {COLORS, BORDER_RADIUS} from '../tokens';
import {ELEMENT_ENTRY_FRAMES} from '../timing';

type StateType = 'idle' | 'active' | 'success' | 'warning' | 'error';

interface StateBadgeProps {
  state: StateType;
  style?: React.CSSProperties;
}

export const StateBadge: React.FC<StateBadgeProps> = ({state, style}) => {
  const frame = useCurrentFrame();
  
  // Opacidade e escala de entrada suave
  const opacity = interpolate(
    frame,
    [0, ELEMENT_ENTRY_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  const scale = interpolate(
    frame,
    [0, ELEMENT_ENTRY_FRAMES],
    [0.5, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  return (
    <div
      style={{
        backgroundColor: COLORS[state] || COLORS.idle,
        borderRadius: BORDER_RADIUS.full,
        width: 16,
        height: 16,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    />
  );
};

