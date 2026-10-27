// src/design-system/components/FocusDim.tsx
// Redutora de opacidade para destacar elemento específico enquanto diminui visibilidade dos demais

import {useCurrentFrame} from 'remotion';
import {COLORS} from '../tokens';

interface FocusDimProps {
  children: React.ReactNode;
  focusedId: string;
  allIds: readonly string[];
  dimOpacity?: number; // Opacidade padrão para elementos não-focados (default: 0.3)
  transitionDuration?: number; // Duração da transição em segundos
}

export const FocusDim: React.FC<FocusDimProps> = ({
  children,
  focusedId,
  allIds,
  dimOpacity = 0.3,
  transitionDuration = 0.3,
}) => {
  const frame = useCurrentFrame();
  
  // Animação suave de transição
  const transitionStyle = `opacity ${transitionDuration}s ease-out`;
  
  return (
    <>
      {/* Renderizar cada child com opacity baseada se é o focado */}
      {React.Children.map(children, (child, index) => {
        if (!child || !React.isValidElement(child)) return child;
        
        const id = allIds[index];
        const isFocused = id === focusedId;
        
        // Opacidade dinâmica
        const opacity = isFocused ? 1 : dimOpacity;
        
        return React.cloneElement(child as React.ReactElement, {
          style: {
            ...(child.props.style || {}),
            opacity,
            transition: transitionStyle,
          },
        });
      })}
    </>
  );
};

