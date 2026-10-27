// templates/VariationsMatrix.tsx
// Matriz de variações: todas testam mesma hipótese com estratégias diferentes
// Importar esta composição na etapa 4 (variações) após aprovação do CP1

import {AbsoluteFill, Sequence, Composition, useCurrentFrame, interpolate} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import {NodeBox} from './design-system/components/NodeBox';
import {AnimatedArrow} from './design-system/components/AnimatedArrow';
import {SplitComparison} from './design-system/components/SplitComparison';
import {COLORS, FONT_FAMILY, SPACING} from './design-system/tokens';
import {FPS, secToFrame, LEAD_FRAMES, CUE} from './AudioSyncMap';
import {calculateMasterDuration} from '../scripts/calculate-master-duration.mjs'; // stub import

// Dados compartilhados por todas as variações
export const sceneData = {
  conceito: "Chamadas de sistema console → API Windows",
  passos: [
    "Programa chama write()",
    "Console intercepta chamadas",
    "Traduz para NtWriteFile",
    "Kernel processa no Windows",
  ],
  metadados: {
    fps: FPS,
    width: 1920,
    height: 1080,
  },
};

export const calculateMetadata: CalculateMetadataFunction<MyVideoProps> = async () => {
  // Derivar durationInFrames do áudio narrativo
  const audioDuration = await calculateMasterDuration('public/narracao.wav');
  
  return {
    durationInFrames: Math.round(audioDuration * FPS),
    defaultCodec: 'h264',
    defaultPixelFormat: 'yuv420p',
    defaultColorSpace: 'bt709',
  };
};

interface MyVideoProps {}

/**
 * Estrutura base para todas variações pedagógicas
 * Cada variação implementará este mesmo data, mas com layout diferente
 */
export const VariationsMatrix: React.FC<MyVideoProps> = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.backgroundDeep}}>
      {/* 
        Nota para implementação:
        
        Criar aqui uma matriz que renderiza TODAS variações em pastas distintas:
        
        <Folder name="02-Variacoes">
          <Folder name="VarA_FluxoLinear">
            <Sequence from={0} durationInFrames={TOTAL}>
              <FluxoLinearImplementation />
            </Sequence>
          </Folder>
          
          <Folder name="VarB_ComparacaoParalela">
            <Sequence from={0} durationInFrames={TOTAL}>
              <ComparacaoParalelaImplementation />
            </Sequence>
          </Folder>
          
          ... mais variações
        </Folder>
        
        Depois escolher UMA variação via checklist da rubrica (30% clareza causal, 25% carga cognitiva, etc.)
      */}
      
      {/* Exemplo placeholder apenas mostrando estrutura */}
      <div style={{padding: SPACING.xxl}}>
        <h1 style={{fontSize: 64, color: COLORS.textPrimary}}>Variations Matrix</h1>
        <p style={{fontSize: 36, color: COLORS.textSecondary}}>
          Implementar cada VarA/B/C/D abaixo em suas próprias pastas<br/>
          Aplicar rubrica pedagógica para selecionar vencedora
        </p>
        
        <div style={{marginTop: SPACING.xl}}>
          <h2 style={{fontSize: 48, color: COLORS.active}}>Cena Data Comum:</h2>
          <pre style={{fontSize: 30, fontFamily: FONT_FAMILY.codeMono, backgroundColor: COLORS.surfaceCard, padding: SPACING.lg, borderRadius: BORDER_RADIUS.large}}>
            {JSON.stringify(sceneData, null, 2)}
          </pre>
        </div>
      </div>
    </AbsoluteFill>
  );
};

