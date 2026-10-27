# Padrões Pedagógicos Validados

Esta documentação lista padrões visuais validados para animações explicativas em Remotion, com exemplos de implementação e casos de uso recomendados.

## Fluxo de Dados (Data Flow Pattern)

**Padrão**: Sequência linear onde elementos são conectados por setas indicando direção do fluxo, cada etapa transforma dado anterior em resultado seguinte.

**Melhor cenário**: Pipelines de processamento, cadeias causais, algoritmos step-by-step, transições de estado em sistemas.

**Quando não usar**: Para comparações paralelas, hierarquias complexas, ou quando ordem não importa causalmente.

### Estrutura base

```typescript
// patterns/data-flow.tsx
interface DataFlowStep {
  id: string;
  label: string;
  description?: string;
  state?: 'idle' | 'active' | 'complete';
}

interface DataFlowProps {
  steps: readonly DataFlowStep[];
  containerWidth?: number;
  spacing?: number; // gap entre passos
}

export const DataFlowPattern: React.FC<DataFlowProps> = ({
  steps,
  containerWidth = 1200,
  spacing = 320,
}) => {
  const frame = useCurrentFrame();
  const totalSteps = steps.length;
  
  // Posições horizontais equidistantes
  const startX = (containerWidth - (totalSteps - 1) * spacing) / 2;
  
  return (
    <div style={{position: 'relative', width: containerWidth}}>
      {/* Renderizar conexões primeiro (background layer) */}
      {steps.map((step, i) => {
        if (i >= totalSteps - 1) return null;
        
        const fromX = startX + i * spacing;
        const toX = fromX + spacing;
        const progress = interpolate(frame, 
          [i * FRAME_DURATION, (i + 1) * FRAME_DURATION],
          [0, 1],
          {extrapolateLeft: 'clamp'}
        );
        
        const {strokeDasharray, strokeDashoffset} = evolvePath(
          interpolate(progress, [0, 1], [0, 1])
        );
        
        return (
          <svg key={`connector-${i}`} style={{position: 'absolute'}}>
            <path
              d={`M${fromX},${HEIGHT/2} L${toX},${HEIGHT/2}`}
              stroke={COLORS.connector}
              strokeWidth={3}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={-strokeDashoffset}
              className="data-flow-arrow"
            />
            <text 
              x={(fromX + toX) / 2} 
              y={HEIGHT/2 - 20}
              textAnchor="middle"
              fontSize={16}
              fill={COLORS.textSecondary}
            >
              Processa
            </text>
          </svg>
        );
      })}
      
      {/* Renderizar nós sobre conexões */}
      {steps.map((step, i) => (
        <NodeBox
          key={step.id}
          label={step.label}
          state={step.state}
          style={{
            position: 'absolute',
            left: startX + i * spacing,
            top: HEIGHT/2 - 40,
            transform: `translateY(${interpolate(frame, 
              [i * FRAME_DURATION - 18, i * FRAME_DURATION], 
              [50, 0],
              {extrapolateLeft: 'clamp'}
            )}px)`
          }}
        />
      ))}
    </div>
  );
};
```

### Variantes validadas

#### Variante A: Flow com feedback loop

Para processos iterativos ou loops de verificação:

```typescript
// Adicionar arrow de retorno da etapa final para intermediária
const feedbackArrow = (
  <path
    d={`M${finalPos.x},${finalPos.y} Q${feedbackControl.x},${feedbackControl.y} ${midPos.x},${midPos.y}`}
    stroke={COLORS.warning}
    strokeWidth={2}
    strokeDasharray="5,5" // dashed indica feedback/retry
    fill="none"
  />
);
```

#### Variante B: Flow paralelo branching

Quando um passo se divide em múltiplos caminhos:

```typescript
// De um node central, criar multiple arrows saindo simultaneamente
const branches = [rightBranch, downBranch];
branches.forEach((branch, idx) => {
  const delay = idx * 12; // stagger entre ramos
  return <AnimatedArrow key={idx} from={center} to={branch.end} offset={delay} />;
});
```

### Regras de aplicação pedagógica

1. **Uma ideia por seta**: Cada conexão deve representar transformação única e clara, nunca múltiplas ações simultâneas
2. **Rótulos indicativos**: Setas devem ter texto indicando TRANSFORMAÇÃO ("converte", "processa", "envia"), não apenas nomes das entidades
3. **Stagger natural**: Gap mínimo 0,2s entre ativação sequencial de conexões adjacentes
4. **Foco progressivo**: Usar FocusDim para apagar steps já completados enquanto highlight atual ativo
5. **Tempo adequado**: Duração de cada step ≥max(1,2s, palavrasNaLabel ÷ 3,5)

## Comparação Lado a Lado (Split Comparison Pattern)

**Padrão**: Dois colunas verticais comparando estados anteriores e posteriores, conceitos alternativos, ou abordagens concorrentes.

**Melhor cenário**: Antes/depois de refatoração/migração, arquitetura X vs Y, problema/solução contrastante.

**Quando não usar**: Quando comparação requer mais de dois itens (usar grid multi-column instead), ou quando relações causais importam mais que contraste estático.

### Implementação padrão

```typescript
// patterns/split-comparison.tsx
interface SplitComparisonProps {
  leftTitle: string;
  rightTitle: string;
  leftSubtitle?: string;
  rightSubtitle?: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  highlightChange?: boolean; // Se true, destacar elementos que mudaram entre left/right
}

export const SplitComparisonPattern: React.FC<SplitComparisonProps> = ({
  leftTitle,
  rightTitle,
  leftSubtitle,
  rightSubtitle,
  leftContent,
  rightContent,
  highlightChange = false,
}) => {
  const {width, height} = useVideoConfig();
  const columnWidth = (width - SPACING.lg) / 2;
  
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', maxWidth: width - SPACING.marginSafe * 2}}>
      {/* Coluna esquerda */}
      <div style={{flex: 1, paddingRight: SPACING.lg / 2}}>
        <h2 style={{fontSize: 48, fontFamily: FONT_FAMILY.conceptSans}}>{leftTitle}</h2>
        {leftSubtitle && <p style={{fontSize: 24, marginTop: SPACING.sm}}>{leftSubtitle}</p>}
        <div style={{marginTop: SPACING.xl}}>
          {highlightChange ? (
            <HighlightChanges left={leftContent} right={rightContent} />
          ) : (
            leftContent
          )}
        </div>
      </div>
      
      {/* Coluna direita */}
      <div style={{flex: 1, paddingLeft: SPACING.lg / 2}}>
        <h2 style={{fontSize: 48, fontFamily: FONT_FAMILY.conceptSans}}>{rightTitle}</h2>
        {rightSubtitle && <p style={{fontSize: 24, marginTop: SPACING.sm}}>{rightSubtitle}</p>}
        <div style={{marginTop: SPACING.xl}}>
          {rightContent}
        </div>
      </div>
      
      {/* Arrow de transição central (opcional) */}
      <AnimatedArrow 
        from={{x: width/2 - columnWidth/2, y: height/2}} 
        to={{x: width/2 + columnWidth/2, y: height/2}} 
        label="Migração"
      />
    </div>
  );
};

// Componente auxiliar para highligtar diferenças
const HighlightChanges: React.FC<{left: React.ReactNode; right: React.ReactNode}> = ({left, right}) => {
  // Em implementação real, identificar elementos diferentes via props diffing
  // Para simplicidade, estilizar tudo como "mudou"
  return (
    <>
      <div style={{opacity: 0.5, filter: 'grayscale(1)'}}>{left}</div>
      <div style={{opacity: 1, filter: 'brightness(1.2)'}}>{right}</div>
    </>
  );
};
```

### Variantes de destaque de mudança

#### Variante A: Blur → Sharp transition

Animar opacidade e blur do lado esquerdo para indicar "antes estava confuso, agora claro":

```typescript
const leftBlur = interpolate(frame, [0, 30], [0.5, 0], {extrapolateLeft: 'clamp'});
const leftOpacity = interpolate(frame, [0, 30], [0.3, 0.7], {extrapolateLeft: 'clamp'});

<div style={{blur: `${leftBlur}px`, opacity: leftOpacity}}>Antes</div>
```

#### Variante B: Highlight boxes nos elementos cambiados

Adicionar retângulos pulsantes ao redor de partes específicas que mudaram:

```typescript
const pulseProgress = spring({frame, fps, config: SPRING_BOUNCY, durationInFrames: 60});
const scale = interpolate(pulseProgress, [0, 1], [1, 1.1], {extrapolateLeft: 'clamp'});

<div style={{transform: `scale(${scale})`, border: `2px solid ${COLORS.focus}`}}>
  Element changed
</div>
```

### Regras de aplicação pedagógica

1. **Títulos simétricos**: Ambos títulos devem ter mesmo tamanho/font-weight para evitar viés visual
2. **Conteúdo equilibrado**: Ambas colunas ocupar aproximadamente mesma densidade visual (não uma coluna vazia)
3. **Alinhamento horizontal**: Elementos comparáveis na mesma altura vertical facilitam comparação direta
4. **Seta de transição**: Adicionar arrow lateral sempre que possível para indicar direcionalidade antes→depois
5. **Limitar a duas opções**: Não forçar três+ items em layout split comparison (usar grid instead)

## Isolamento de Camadas (Layer Isolation Pattern)

**Padrão**: Mostrar sistema complexo revelando camadas incrementalmente, uma por vez, mantendo contexto mas reduzindo carga cognitiva simultânea.

**Melhor cenário**: Arquiteturas em camadas, stacks tecnológicos, sistemas distribuídos com múltiplos níveis de abstração.

**Quando não usar**: Quando todas camadas interagem intensamente simultaneamente (melhor fluxo direto), ou quando layers são muito poucas (≤2 trivial mostrar juntas).

### Estrutura básica

```typescript
// patterns/layer-isolation.tsx
interface Layer {
  id: string;
  name: string;
  component: React.FC;
  description: string;
  isActive?: boolean;
}

interface LayerIsolationProps {
  layers: readonly Layer[];
  activeLayerId: string;
}

export const LayerIsolationPattern: React.FC<LayerIsolationProps> = ({
  layers,
  activeLayerId,
}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  
  const layerHeight = height / layers.length;
  
  return (
    <div style={{position: 'relative', height}}>
      {layers.map((layer, index) => {
        const isActive = layer.id === activeLayerId;
        const translateY = interpolate(frame, 
          [index * FRAME_DURATION - 18, index * FRAME_DURATION, index * FRAME_DURATION + 18],
          [50, 0, -50],
          {extrapolateLeft: 'clamp'}
        );
        
        const opacity = isActive ? 1 : 
                       interpolate(frame, 
                         [index * FRAME_DURATION - 18, index * FRAME_DURATION],
                         [0.2, 1],
                         {extrapolateLeft: 'clamp'}
                       );
        
        return (
          <div
            key={layer.id}
            style={{
              position: 'absolute',
              top: index * layerHeight,
              height: layerHeight,
              width: '100%',
              transform: `translateY(${translateY}px)`,
              opacity,
              transition: 'opacity 0.3s',
            }}
          >
            <LayerCard
              name={layer.name}
              description={layer.description}
              isActive={isActive}
            >
              <layer.component />
            </LayerCard>
          </div>
        );
      })}
    </div>
  );
};

// Card individual com borda destacada quando ativo
const LayerCard: React.FC<{name: string; description: string; isActive?: boolean; children: React.ReactNode}> = ({
  name, description, isActive, children,
}) => {
  const borderColor = isActive ? COLORS.active : COLORS.borderSubtle;
  const borderWidth = isActive ? 4 : 2;
  
  return (
    <div style={{
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: BORDER_RADIUS.large,
      backgroundColor: isActive ? COLORS.surfaceElevated : COLORS.surfaceCard,
      padding: SPACING.lg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <h3 style={{fontSize: 32, marginBottom: SPAGING.sm}}>{name}</h3>
      {description && <p style={{fontSize: 20, color: COLORS.textSecondary}}>{description}</p>}
      <div style={{marginTop: SPACING.xl}}>
        {children}
      </div>
    </div>
  );
};
```

### Variantes de isolamento

#### Variante A: Fade in/out suave

Alternativa ao translate animation: revelar camadas via fade instead of movement.

```typescript
const fadeIn = interpolate(frame, [startFrame, endFrame], [0, 1]);
const fadeOut = interpolate(frame, [endFrame, endFrame + 18], [1, 0]);
const opacity = Math.max(fadeIn, fadeOut);
```

#### Variante B: Overlay dimming de outras camadas

Quando focar uma camada específica, escurecer todas as outras para redução drástica de distração:

```typescript
const otherOpacity = activeLayerIndex === index ? 1 : 0.15;
<div style={{opacity: otherOpacity, filter: 'blur(2px)'}}>Inactive layer</div>
```

#### Variante C: Stack collapse animation

Animar empilhamento físico das camadas como cartas virando:

```typescript
const rotateZ = interpolate(frame, [startFrame, midFrame], [-30, 0], {/* ... */});
<div style={{transform: `rotateZ(${rotateZ}deg) translateZ(...)`}}>Rotating card</div>
```

### Regras de aplicação pedagógica

1. **Número limitado de camadas**: Máximo 5-6 layers visíveis simultanemente (reduzir se mais)
2. **Hierarquia clara**: Ordem visual corresponde a ordem lógica (top-down ou bottom-up consistente)
3. **Transição suave**: Stagger entre camadas ≥0,2s para permitir processamento cognitivo
4. **Descrição textual**: Cada layer deve ter label + description curta (≤15 palavras) para contexto
5. **Retorno ao contexto**: Sempre mostrar todas camadas novamente após detalhar cada uma individualmente

## Zoom Hierárquico (Hierarchical Zoom Pattern)

**Padrão**: Começar visão macro do sistema inteiro, depois dar zoom progressivo em componentes específicos mantendo contexto relacional.

**Melhor cenário**: Sistemas complexos organizados hierarquicamente, organizações distribuidas, aplicações com múltiplas camadas de abstração.

**Quando não usar**: Quando sistema é plano sem hierarquia clara, ou quando foco único já compreensível sem contexto macro.

### Implementação completa

```typescript
// patterns/hierarchical-zoom.tsx
interface ZoomLevel {
  level: number;
  focusComponent: React.FC;
  scaleFactor: number; // 0.2 = 20% tamanho original, 1.0 = normal
  panOffset?: {x: number; y: number};
  revealAtFrame: number; // Frame when this level becomes visible
  hideAfterFrame?: number; // Frame when this level fades out
}

interface HierarchicalZoomProps {
  levels: readonly ZoomLevel[];
}

export const HierarchicalZoomPattern: React.FC<HierarchicalZoomProps> = ({levels}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  
  return (
    <div style={{overflow: 'hidden', width, height, position: 'relative'}}>
      {levels.map((level, levelIndex) => {
        const isCurrent = frame >= level.revealAtFrame && (!level.hideAfterFrame || frame <= level.hideAfterFrame);
        const isVisible = isCurrent || 
                         (levelIndex > 0 && frame >= levels[levelIndex - 1].revealAtFrame && !levels[levelIndex - 1].hideAfterFrame);
        
        if (!isVisible) return null;
        
        const progress = interpolate(frame,
          [level.revealAtFrame, level.revealAtFrame + 30],
          [0, 1],
          {extrapolateLeft: 'clamp'}
        );
        
        const scale = interpolate(progress, [0, 1], [0.1, level.scaleFactor]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        
        return (
          <div
            key={level.level}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width,
              height,
              transform: `scale(${scale}) translate(${level.panOffset?.x || 0}px, ${level.panOffset?.y || 0}px)`,
              opacity,
              transition: 'transform 0.5s, opacity 0.5s',
            }}
          >
            <level.focusComponent />
          </div>
        );
      })}
      
      {/* Breadcrumbs de nível atual */}
      <div style={{position: 'absolute', bottom: SPACING.xl, left: '50%', transform: 'translateX(-50%)'}}>
        {levels.filter(l => l.revealAtFrame <= frame).map(l => (
          <span key={l.level} style={{fontSize: 24, marginRight: SPACING.md}}>
            {l.level === 1 ? 'Macro' : l.level === 2 ? 'Componente' : l.level === 3 ? 'Detalhe' : `Nível ${l.level}`}
            {l.hideAfterFrame && l.hideAfterFrame > frame && <span style={{color: COLORS.active}}> ●</span>}
          </span>
        ))}
      </div>
    </div>
  );
};
```

### Exemplo prático: Sistema distribuído

```typescript
const levels: ZoomLevel[] = [
  {
    level: 1,
    scaleFactor: 0.3,
    revealAtFrame: 0,
    hideAfterFrame: 60,
    focusComponent: SystemOverview, // Todos microserviços em visão aérea
  },
  {
    level: 2,
    scaleFactor: 0.6,
    revealAtFrame: 40,
    hideAfterFrame: 100,
    panOffset: {x: -200, y: -100}, // Pan para componente específico
    focusComponent: ServiceDetail, // Um service individual com threads internos
  },
  {
    level: 3,
    scaleFactor: 1.0,
    revealAtFrame: 80,
    focusComponent: RequestPathVisualization, // Path exato de requisição através de layers
  },
];
```

### Regras de aplicação pedagógica

1. **Máximo 3-4 níveis**: Mais níveis confundem espectador (macro → sub-componente → detail extremo → ultra-detail)
2. **Contexto persistente**: Manter breadcrumbs ou mini-map mostrando localização atual dentro hierarchy
3. **Transição suave**: Scale animation deve durar ≥30 frames (1s a 30fps) para sensação natural de zoom
4. **Labels contextuais**: Sempre mostrar qual nível estamos observando (ex: "Visão geral → Service X → Request flow")
5. **Retorno ao macro**: Após detalhar completamente, voltar à visão macro para reorientar espectador

## Callout Annotativo (Callout Annotation Pattern)

**Padrão**: Destacar elementos específicos com anotações pontuais (setas + caixas de texto) apontando diretamente ao alvo.

**Melhor cenário**: Explicar partes específicas de diagrama complexo, definir termos técnicos localizados, chamar atenção para exceções/regulações.

**Quando não usar**: Muitas callouts (≥5 em cena) sobrecarregam visual, preferir agrupamento ou paginação.

### Componente robusto

```typescript
// components/callout.tsx
interface CalloutTarget {
  x: number;
  y: number;
  label: string;
  description: string;
}

interface CalloutProps {
  targets: readonly CalloutTarget[];
  triggerFrame?: number; // Frame when callout appears (default: immediate)
}

export const CalloutComponent: React.FC<CalloutProps> = ({targets, triggerFrame = 0}) => {
  const frame = useCurrentFrame();
  
  return (
    <svg style={{position: 'absolute', width: '100%', height: '100%'}}>
      {targets.map((target, idx) => {
        const isVisible = frame >= triggerFrame + idx * 18; // stagger entre callouts
        
        if (!isVisible) return null;
        
        const progress = interpolate(frame, 
          [triggerFrame + idx * 18, triggerFrame + idx * 18 + 18],
          [0, 1]
        );
        
        const {x: arrowHeadX, y: arrowHeadY} = getPointOnPath(target.x, target.y, progress);
        const boxX = target.x + 40;
        const boxY = target.y - 30;
        
        return (
          <g key={idx} style={{opacity: interpolate(progress, [0, 1], [0, 1])}}>
            {/* Arrow path */}
            <path
              d={`M${boxX - 10},${boxY + 20} L${arrowHeadX},${arrowHeadY}`}
              stroke={COLORS.connector}
              strokeWidth={2}
              fill="none"
              markerEnd={`url(#arrowhead-${idx})`}
            />
            
            {/* Callout box */}
            <rect
              x={boxX}
              y={boxY}
              width={200}
              height={60}
              rx={BORDER_RADIUS.small}
              fill={COLORS.surfaceElevated}
              stroke={COLORS.borderStrong}
              strokeWidth={1}
            />
            
            {/* Label text */}
            <text x={boxX + 12} y={boxY + 22} fontSize={18} fontWeight={FONT_WEIGHT.semiBold}>
              {target.label}
            </text>
            
            {/* Description text */}
            <text x={boxX + 12} y={boxY + 42} fontSize={14} fill={COLORS.textSecondary}>
              {target.description}
            </text>
          </g>
        );
      })}
      
      <defs>
        {targets.map((_, idx) => (
          <marker
            key={idx}
            id={`arrowhead-${idx}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.connector} />
          </marker>
        ))}
      </defs>
    </svg>
  );
};
```

### Uso prático

```typescript
<CalloutComponent
  targets={[
    {
      x: 400,
      y: 200,
      label: "API Gateway",
      description: "Ponto único de entrada para todos clients",
    },
    {
      x: 600,
      y: 350,
      label: "Cache Redis",
      description: "Reduz latência em 90% para queries repetidas",
    },
    {
      x: 800,
      y: 200,
      label: "Database Shard",
      description: "Horizontal scaling via sharding key user_id",
    },
  ]}
  triggerFrame={10}
/>
```

### Regras de aplicação pedagógica

1. **Máximo 3-4 callouts por cena**: Acima distrai, dividir em múltiplos beats se necessário
2. **Texto ultra-curto**: Labels ≤4 palavras, descriptions ≤12 palavras total
3. **Posicionamento inteligente**: Box nunca cobre elemento sendo apontado (sempre offset direito ou abaixo)
4. **Cores semânticas consistentes**: Callouts usam mesmas cores do sistema principal (connector active, text primary)
5. **Stagger natural**: Gap ≥0,2s entre aparición sequencial de callouts adjacentes

