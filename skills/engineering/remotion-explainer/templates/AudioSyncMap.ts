// src/AudioSyncMap.ts
// ÚNICA FONTE DE VERDADE TEMPORAL DO PROJETO
// Todos frames devem derivar deste arquivo, nenhum número literal permitido fora dele

export const FPS = 30; // ← Deve COINCIDIR COM TIMELINE DO RESOLVE (confirme isso!)

export const secToFrame = (sec: number): number => Math.round(sec * FPS);

export const LEAD_FRAMES = secToFrame(0.12); // Antecipação visual da narração

export const CUE = {
  // Exemplo: mapeamento de beats a cues semânticos da narração
  INTRO_PROBLEMA: {
    label: "Introdução do problema",
    sec: 0.0,               // Tempo absoluto desde início áudio
    quote: "Olá, hoje veremos como chamadas de sistema são traduzidas para a API do Windows.",
    estimated?: true,       // true se estimado manualmente, false se transcritos com Whisper
  },
  EXPLICA_RECOMPILACAO: {
    label: "Explica a recompilação estática",
    sec: 7.4,
    quote: "Quando você recompile um programa, o compilador traduz essas chamadas automaticamente.",
    estimated?: true,
  },
  MOSTRA_WINDOWS_API: {
    label: "Mostra a API do Windows",
    sec: 12.1,
    quote: "No Windows, a função NtQuerySystemInformation vira uma chamada para CallWindowProc.",
    estimated?: true,
  },
  CONCLUSAO: {
    label: "Conclusão",
    sec: 22.5,
    quote: "Resumindo: recompilação permite adaptação automática entre plataformas diferentes.",
    estimated?: true,
  },
} as const satisfies Record<string, Cue>;

type Cue = {
  label: string;
  sec: number;
  quote: string;
  estimated?: boolean;
};

// Helper functions para cálculos derivados
export const getTotalDurationInSeconds = (): number => {
  const cues = Object.values(CUE);
  return cues.length > 0 ? cues[cues.length - 1].sec : 0;
};

export const getTotalDurationInFrames = (): number => {
  return secToFrame(getTotalDurationInSeconds());
};

// Para cada cue, calcular frame inicial e final (com lead time)
export const getCueFrames = (cueKey: keyof typeof CUE): {from: number; to: number} => {
  const cue = CUE[cueKey];
  const from = secToFrame(cue.sec) - LEAD_FRAMES; // Começa 12 frames antes
  const nextCue = Object.values(CUE)[Object.keys(CUE).indexOf(cueKey) + 1];
  const to = nextCue ? secToFrame(nextCue.sec) - LEAD_FRAMES : getTotalDurationInFrames();
  
  return {from, to};
};

