// templates/PilotComposition.tsx
// Composição Piloto: 5-10s verificando tokens, direções visuais e padrões de animação
// Nunca codificar vídeo inteiro antes do CP1 - apenas este piloto!

import {AbsoluteFill, Sequence, Composition, useCurrentFrame, interpolate} from 'remotion';
import {NodeBox} from './design-system/components/NodeBox';
import {AnimatedArrow} from './design-system/components/AnimatedArrow';
import {StateBadge} from './design-system/components/StateBadge';
import {FocusDim} from './design-system/components/FocusDim';
import {COLORS, FONT_FAMILY, SPACING, BORDER_RADIUS} from './design-system/tokens';
import {FPS, secToFrame, LEAD_FRAMES} from './AudioSyncMap';
import {SPRING_SNAPPY} from './design-system/springs';
import {ELEMENT_ENTRY_FRAMES} from './design-system/timing';

interface PilotCompositionProps {}

export const PilotComposition: React.FC<PilotCompositionProps> = () => {
  return (
    <Composition
      id="PilotComposition"
      component={Pilot}
      durationInFrames={secToFrame(8)} // 8 segundos piloto
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

const Pilot: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.backgroundDeep,
        fontFamily: FONT_FAMILY.conceptSans,
      }}
    >
      {/* Título da composição */}
      <div
        style={{
          position: 'absolute',
          top: SPACING.marginSafe,
          left: SPACING.marginSafe,
          right: SPACING.marginSafe,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: SPACING.xl,
          }}
        >
          Piloto de Animação Explorativa
        </h1>
        
        <p style={{fontSize: 36, color: COLORS.textSecondary}}>
          Este piloto testa:<br/>
          • Tokens de cores e tipografia<br/>
          • Springs de animação (SNAPPY)<br/>
          • Conectores evoluídos<br/>
          • Sistema de foco (FocusDim)
        </p>
      </div>
      
      {/* Sequência de exemplo: estado → transformação → novo estado */}
      <Sequence from={secToFrame(1)} durationInFrames={secToFrame(3)}>
        {/* Estado inicial idle */}
        <div style={{position: 'absolute', top: '40%', left: '20%'}}>
          <FocusDim focusedId="node1" allIds={['node1', 'node2']}>
            <NodeBox state="idle" label="Console API" style={{marginRight: SPACING.xxl}} />
          </FocusDim>
          
          <FocusDim focusedId="connector" allIds={['connector', 'node2']}>
            <AnimatedArrow 
              from={{x: 550, y: 500}} 
              to={{x: 750, y: 500}} 
              label="Traduz"
            />
          </FocusDim>
          
          <FocusDim focusedId="node2" allIds={['node2']}>
            <NodeBox state="idle" label="Windows API" />
          </FocusDim>
        </div>
      </Sequence>
      
      {/* Evento ativo: console API muda para active */}
      <Sequence from={secToFrame(4)} durationInFrames={secToFrame(1)}>
        <NodeBox 
          state="active" 
          label="Console API" 
          style={{position: 'absolute', top: '40%', left: '20%'}} 
        />
        <AnimatedArrow 
          from={{x: 550, y: 500}} 
          to={{x: 750, y: 500}} 
          label="Traduz"
          style={{position: 'absolute', top: '40%', left: '20%'}}
        />
        <NodeBox 
          state="active" 
          label="Windows API" 
          style={{position: 'absolute', top: '40%', left: '50%'}} 
        />
      </Sequence>
      
      {/* Estados finais: badges de sucesso nos elementos */}
      <Sequence from={secToFrame(5)} durationInFrames={secToFrame(2)}>
        <div style={{position: 'absolute', top: '40%', left: '20%'}}>
          <NodeBox state="success" label="Console API" />
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
            }}
          >
            <StateBadge state="success" />
          </div>
        </div>
        
        <AnimatedArrow 
          from={{x: 550, y: 500}} 
          to={{x: 750, y: 500}} 
          label="✅ Tradução OK"
        />
        
        <div style={{position: 'absolute', top: '40%', left: '50%'}}>
          <NodeBox state="success" label="Windows API" />
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
            }}
          >
            <StateBadge state="success" />
          </div>
        </div>
      </Sequence>
      
      {/* Rodapé informativo */}
      <div
        style={{
          position: 'absolute',
          bottom: SPACING.marginSafe,
          left: SPACING.marginSafe,
          right: SPACING.marginSafe,
          textAlign: 'center',
        }}
      >
        <span style={{fontSize: 24, color: COLORS.textMuted}}>
          Versão: v1.0 • FPS: {FPS} • Duração: 8s
        </span>
      </div>
    </AbsoluteFill>
  );
};

