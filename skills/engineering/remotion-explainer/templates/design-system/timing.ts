// src/design-system/timing.ts
// Constantes de timing em segundos, convertidas para frames baseado no FPS atual

export const FPS = 30; // Deve coincidir com timeline do DaVinci Resolve!

export const secToFrame = (sec: number): number => Math.round(sec * FPS);

// Durações padrão validadas pedagogicamente
export const ELEMENT_ENTRY_DURATION = 0.6;      // Entrada de elemento (spring animação completa)
export const STAGGER_DELAY = 0.2;               // Delay entre elementos relacionados
export const LEAD_TIME = 0.12;                  // Antecipação visual da narração (lead frames)
export const BEAT_RESPIRATION = 0.15;           // Respiro entre beats (pausa antes próximo beat)
export const STATE_TRANSITION_DURATION = 0.8;   // Transição completa estado A → B

// Frames calculados automaticamente
export const ELEMENT_ENTRY_FRAMES = secToFrame(ELEMENT_ENTRY_DURATION);        // 18 frames @ 30fps
export const STAGGER_FRAMES = secToFrame(STAGGER_DELAY);                       // 6 frames
export const LEAD_FRAMES = secToFrame(LEAD_TIME);                              // 4 frames
export const BEAT_RESPIRATION_FRAMES = secToFrame(BEAT_RESPIRATION);           // 5 frames
export const STATE_TRANSITION_FRAMES = secToFrame(STATE_TRANSITION_DURATION);  // 24 frames

// Tempo mínimo de leitura por beat
export const WORDS_PER_SECOND = 3.5;

export function calculateMinBeatDuration(wordsInText: number): number {
  const peloLeitura = wordsInText / WORDS_PER_SECOND;
  return Math.max(1.2, peloLeitura); // sempre ≥ 1.2s
}

export function calculateMinBeatDurationInFrames(wordsInText: number): number {
  return secToFrame(calculateMinBeatDuration(wordsInText));
}

