// src/design-system/springs.ts
// Presets de springs para animações determinísticas no Remotion
// Valores baseados em testes de feedback tátil e naturalidade

import type {SpringConfig} from 'remotion';

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

// Uso típico por cenário:
// - SNAPPY: interface elements rápidas, decisivas (botões, state transitions)
// - SMOOTH: transições suaves, mudanças de estado progressivas (fade-in/out, entrada elementos)
// - BOUNCY: celebrações, sucesso, feedback positivo (badges success, highlight appearances)
// 
// Sempre usar spring({frame, fps, config: SPRING_...}) com fps explícito
