# Rubrica de Variações Pedagógicas

Esta documentação define estratégias das variações e rubrica de pontuação para seleção objetiva entre diferentes abordagens pedagógicas.

## Estratégias das Variações

Cada variação testa uma hipótese pedagógica diferente sobre como melhor comunicar o mesmo conceito técnico. Todas compartilham os mesmos dados (scene-data.ts), mesmo timing, mesmos componentes do design system. Só muda estratégia de layout e revelação.

### VarA_FluxoLinear: sequência temporal passo a passo

**Hipótese**: A causa e o efeito ficam claros quando mostrados em sequência temporal linear com setas conectando cada passo.

**Quando usar**: Para fluxos de dados, pipelines de processamento, cadeias causais onde ordem importa fundamentalmente.

**Estrutura típica**:
```typescript
// 02-Variacoes/VarA_FluxoLinear/PilotVariation.tsx
export const FluxoLinear: React.FC = () => {
  return (
    <Folder name="VarA_FluxoLinear">
      {/* Hipótese: mostra fluxo causal sequencial */}
      <Sequence from={0} durationInFrames={90}>
        <NodeBox label="Entrada" state="idle" />
      </Sequence>
      <AnimatedArrow from={entradaPos} to={etapa1Pos} label="Transforma" />
      <Sequence from={24} durationInFrames={24}>
        <NodeBox label="Etapa 1" state="active" />
      </Sequence>
      <AnimatedArrow from={etapa1Pos} to={etapa2Pos} label="Processa" />
      <Sequence from={48} durationInFrames={24}>
        <NodeBox label="Etapa 2" state="active" />
      </Sequence>
      <AnimatedArrow from={etapa2Pos} to={saidaPos} label="Output" />
      <Sequence from={72} durationInFrames={18}>
        <NodeBox label="Saída" state="success" />
      </Sequence>
    </Folder>
  );
};
```

**Pontos fortes**:
- Clareza máxima de relação causal
- Fácil seguir lógica "se X então Y"
- Natural para explicações de algoritmo/processo

**Ponto fracos**:
- Ocupa mais tempo total (cada passo adiciona frames)
- Menos adequado para comparações simultâneas
- Pode parecer trivial demais para conceitos já familiares

### VarB_ComparacaoParalela: antes/depois lado a lado

**Hipótese**: O contraste visual entre "antes" e "depois" explica mudanças melhor que sequencia temporal, pois permite comparação direta.

**Quando usar**: Quando conceito envolve transformação significativa de estado, arquitetura ou comportamento (ex: arquitetura console vs PC).

**Estrutura típica**:
```typescript
// 02-Variacoes/VarB_ComparacaoParalela/PilotVariation.tsx
export const ComparacaoParalela: React.FC = () => {
  return (
    <Folder name="VarB_ComparacaoParalela">
      {/* Hipótese: comparação paralela destaca mudança */}
      <SplitComparison 
        leftTitle="Antes"
        rightTitle="Depois"
        leftContent={<ConsoleArchitecture />}
        rightContent={<PCArchitecture />}
      />
      <AnimatedArrow from="console→pc" label="Migração" stroke="highlight" />
    </Folder>
  );
};
```

**Pontos fortes**:
- Diferenças saltam aos olhos visualmente
- Reduz necessidade de explicação verbal
- Excelente para mostrar evolução/migração/refatoração

**Pontos fracos**:
- Requer elementos comparáveis em ambas colunas
- Mais difícil mostrar transição dinâmica
- Pode sobrecarregar se ambos lados densos

### VarC_ZoomHierarquico: macro para micro

**Hipótese**: Partir da visão macro mantendo contexto reduz confusão, depois dar zoom no componente que muda preserva significado relacional.

**Quando usar**: Para sistemas complexos com múltiplos níveis de abstração, hierarquias organizacionais, arquiteturas distribuídas.

**Estrutura típica**:
```typescript
// 02-Variacoes/VarC_ZoomHierarquico/PilotVariation.tsx
export const ZoomHierarquico: React.FC = () => {
  return (
    <Folder name="VarC_ZoomHierarquico">
      {/* Hipótese: zoom progressivo mantém contexto */}
      <Sequence from={0} durationInFrames={18}>
        {/* Visão macro: sistema inteiro reduzido */}
        <AbsoluteFill>
          <SystemOverview scale={0.5} opacity={dim} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={18} durationInFrames={36}>
        {/* Zoom no módulo específico */}
        <ComponentFocus scale={1} opacity={1}>
          <DetailedDiagram />
        </ComponentFocus>
      </Sequence>
    </Folder>
  );
};
```

**Pontos fortes**:
- Mantém contexto durante detalhamento
- Evita sensação de "perder o panorama geral"
- Natural para tutoriais guiados

**Pontos fracos**:
- Requer escala consistente (zoom não deve distorcer)
- Pode parecer lento se público já conhece macro
- Difícil de polir animações de transição

### VarD_MinimalistaFoco: menos elementos, impacto máximo

**Hipótese**: Redução drástica de elementos visuais reduz carga cognitiva permitindo foco exclusivo na troca central.

**Quando usar**: Quando conceito principal pode ser isolado completamente, público tem conhecimento prévio suficiente para preencher lacunas.

**Estrutura típica**:
```typescript
// 02-Variacoes/VarD_MinimalistaFoco/PilotVariation.tsx
export const MinimalistaFoco: React.FC = () => {
  return (
    <Folder name="VarD_MinimalistaFoco">
      {/* Hipótese: minimalismo amplia compreensão do essencial */}
      <Sequence from={0} durationInFrames={30}>
        {/* Apenas elemento que muda + rótulo grande */}
        <div style={{fontSize: 72}}>
          <StateTransition active={frame > 18} />
        </div>
        <span style={{fontSize: 36, marginTop: SPACING.xl}}>
          Chamada de Sistema → API Windows
        </span>
      </Sequence>
    </Folder>
  );
};
```

**Pontos fortes**:
- Carga cognitiva mínima possível
- Mensagem impossível de perder entre distratores
- Impacto emocional via tipografia grande

**Pontos fracos**:
- Risco de perda de informação técnica importante
- Pode parecer simplista demais
- Não serve para públicos iniciantes que precisam contexto

## Tabela Comparativa Resumida

| Estratégia | Clareza Causal | Carga Cognitiva | Fidelidade Técnica | Ritmo Narração | Reaproveitamento DS |
|------------|----------------|-----------------|-------------------|----------------|---------------------|
| VarA_FluxoLinear | Alta | Média | Alta | Médio-Alto | Alto |
| VarB_ComparacaoParalela | Média-Baixa | Média | Muito alta | Baixo-Médio | Alto |
| VarC_ZoomHierarquico | Alta | Média-Alta | Muito alta | Médio | Médio |
| VarD_MinimalistaFoco | Baixa-Média | Muito baixa | Baixa-Média | Alto | Alto |

*Legend*: 
- **Clareza Causal**: quão bem a relação causa→efeito é comunicada
- **Carga Cognitiva**: quantidade de informação processável simultaneamente (menor melhor)
- **Fidelidade Técnica**: precisão na representação dos detalhes técnicos
- **Ritmo Narração**: compatibilidade com velocidade média de narração (~2,5 palavras/s PT-BR)
- **Reaproveitamento DS**: quanto o padrão pode ser usado em futuros projetos

## Rubrica de Pontuação Detalhada

Aplicar rubrica abaixo para cada variação rascunho, calculando nota ponderada final.

### Critério 1: Clareza da relação causa e efeito (Peso: 30%)

**O que medir**: O observador consegue identificar qual elemento causa qual efeito apenas olhando?

**Como avaliar**:
1. Mostrar still frame de transição chave sem narração
2. Perguntar: "O que está acontecendo aqui? Qual coisa causou qual?"
3. Medir % de acertos em teste com n≥5 pessoas (ou autoavaliação criteriosa se n=1)

**Escala de pontuação (1-5)**:
- **1**: Observadores dizem "não sei qual causa qual" ou inventam causalidade errada
- **2**: Maioria identifica direção correta mas não confiança ("acho que é isso...")
- **3**: maioria (>60%) identifica causalidade correta, alguns erros específicos
- **4**: maioria clara, poucos erros menores (detalhes secundários)
- **5**: 100% identifique causalidade perfeitamente, resposta unânime

**Exemplos por variação**:
- VarA_FluxoLinear: normalmente 4-5 (setas mostram direção claramente)
- VarB_ComparacaoParalela: normalmente 3 (comparação nem sempre implica causalidade direta)
- VarC_ZoomHierarquico: normalmente 4-5 (zoom mostra dependência hierárquica)
- VarD_MinimalistaFoco: normalmente 2-3 (foco extremo perde contexto causal)

### Critério 2: Carga cognitiva (Peso: 25%)

**O que medir**: Quantidade de elementos novos simultâneos, densidade textual, complexidade visual.

**Como avaliar**:
1. Contar elementos novos aparecidos por beat (≤4 ideal)
2. Medir palavras por frame (≤12 ideal, ≤30 total scene)
3. Verificar movimentos simultâneos principais (1 ideal, 2+ problemático)
4. Teste mudo: quantas vezes observador precisa rewinds/confusão?

**Escala de pontuação (1-5)**:
- **1**: >6 elementos novos por beat, texto denso (>50 palavras), ≥3 movimentos competindo
- **2**: 5-6 elementos, 30-50 palavras, 2-3 movimentos
- **3**: 4-5 elementos, 15-30 palavras, 1-2 movimentos com respiração adequada
- **4**: 2-4 elementos, ≤15 palavras, 1 movimento principal claro
- **5**: 1-2 elementos críticos, ≤10 palavras, movimento único absoluto

**Observações**: menor carga cognitiva nem sempre melhor se sacrifica fidelidade técnica. Balance necessário.

### Critério 3: Fidelidade ao conceito técnico (Peso: 20%)

**O que medir**: Precisão na representação dos detalhes técnicos, terminologia correta, ausência de oversimplification prejudicial.

**Como avaliar**:
1. Expert review: especialista no domínio valida cada afirmação visual
2. Verificar termos técnicos (IDs, nomes de APIs, tipos de dados)
3. Checar representação espacial/proporcional quando aplicável (ex: diagrama de arquitetura)
4. Confirmar que nenhuma informação crítica foi omitida

**Escala de pontuação (1-5)**:
- **1**: Erros técnicos graves presentes, terminologia incorreta, simplificação engrosa
- **2**: Alguns detalhes faltando, termos usados corretamente mas contexto incompleto
- **3**: Informações principais presentes, pequenos detalhes simplificados aceitavelmente
- **4**: Quase todos detalhes técnicos representados fielmente, apenas convenções estéticas simplificadas
- **5**: Representação extremamente precisa, todas informações relevantes preservadas

**Atenção**: VarD_MinimalistaFoco frequentemente pontua baixo aqui porque minimalismo por definição omite detalhes.

### Critério 4: Ritmo com a narração (Peso: 15%)

**O que medir**: Compatibilidade entre duração dos beats e velocidade natural de narração em PT-BR (~2,5 palavras/s).

**Como avaliar**:
1. Somar duração total estimada de todas variações
2. Comparar com duração alvo do briefing (ex: 60-90s)
3. Verificar gaps entre beats: há respiro suficiente (~0,15s)?
4. Confirmar anticipação vocal aplicada (LEAD_FRAMES ≈12 antes palavra)

**Escala de pontuação (1-5)**:
- **1**: Animação muito lenta (duração 2× objetivo) ou muito rápida (text não dá pra ler)
- **2**: Duração ±50% do alvo, gaps ausentes ou excessivos, lead inconsistente
- **3**: Duração ±25% do alvo, gaps adequados, lead aplicado majoritariamente
- **4**: Duração ±10%, respiração perfeita, antecipação consistente
- **5**: Sincronização perfeita, cada evento cai exatamente LEAD_FRAMES antes palavra correspondente

**Nota**: Esta métrica depende muito da narração específica. Variar conforme script real.

### Critério 5: Reaproveitamento no design system (Peso: 10%)

**O que medir**: Quanto o padrão visual/animacional criado pode ser reutilizado em futuros projetos educacionais.

**Como avaliar**:
1. Componentes novos criados: node box, arrow pattern, badge style, etc.
2. Layout templates generalizáveis (split comparison, zoom hierarchy)
3. Springs/timing presets definidos e documentados
4. Padrões documentados em DECISIONS.md para referência futura

**Escala de pontuação (1-5)**:
- **1**: Todo custom code específico deste projeto, nada transferível
- **2**: Alguns utilitários reutilizáveis, layout específico demais
- **3**: 2-3 componentes novos documentados, 1-2 padrões de layout genéricos
- **4**: 4+ componentes, 3+ padrões, springs/timing bem parametrizados
- **5**: Library completa de patterns reaproveitáveis, documentação exemplar, fácil onboarding para outros devs

**Exemplo**: VarA_FluxoLinear cria padrão de pipeline reutilizável (alto reaproveitamento). VarB_ComparacaoParalela cria SplitComparison template (muito alto). VarC_ZoomHierarquico cria zoom pattern (alto). VarD_MinimalistaFoco cria apenas tipografia (baixo).

## Cálculo da Nota Ponderada

Para cada variação, calcular:

```javascript
const peso = {
  clarezaCausal: 0.30,
  cargaCognitiva: 0.25,
  fidelidadeTecnica: 0.20,
  ritmoNarracao: 0.15,
  dsReuse: 0.10,
};

function calcularNota(wa, wc, wf, wr, wdu) {
  return wa * peso.clarezaCausal +
         wc * peso.cargaCognitiva +
         wf * peso.fidelidadeTecnica +
         wr * peso.ritmoNarracao +
         wdu * peso.dsReuse;
}

// Exemplo VarB_ComparacaoParalela:
const pontuacao_B = {
  clarezaCausal: 3.5,   // moderado (sem setas diretas)
  cargaCognitiva: 4,    // bom (dois colunas equilibradas)
  fidelidadeTecnica: 4.5, // excelente (mantém todos detalhes)
  ritmoNarracao: 2.5,   // baixo (transição lenta)
  dsReuse: 4,           // alto (SplitComparison template)
};

const nota_ponderada_B = 
  3.5 * 0.30 +  4 * 0.25 +  4.5 * 0.20 +  2.5 * 0.15 +  4 * 0.10
= 1.05 +  1.00 +  0.90 +  0.375 +  0.40
= 3.725 ≈ 3.7;
```

## Modelo de Apresentação para o Criador

Sempre apresentar tabela completa com esta estrutura:

```markdown
## Avaliação das Variações Pedagógicas

### Tabela de pontuação

| Variação | Clareza (30%) | Carga (25%) | Fidelidade (20%) | Ritmo (15%) | DS (10%) | **Ponderada** |
|----------|---------------|-------------|------------------|-------------|----------|---------------|
| VarA_FluxoLinear | 4,5 | 3,5 | 4,0 | 4,0 | 4,0 | **4,1** |
| VarB_ComparacaoParalela | 3,5 | 4,0 | 4,5 | 2,5 | 4,0 | **3,7** |
| VarC_ZoomHierarquico | 4,0 | 3,0 | 4,5 | 3,0 | 3,5 | **3,7** |
| VarD_MinimalistaFoco | 2,5 | 5,0 | 2,5 | 4,5 | 3,5 | **3,3** |

**Recomendação inicial**: VarA_FluxoLinear (nota 4,1) - melhor balance entre clareza causal e ritmo.

### Justificativa pedagógica

VarA_FluxoLinear recebe nota mais alta principalmente por:
- Claramente comunica causa→efeito através de setas sequenciais (4,5/5)
- Mantém ritmo adequado à narração (~2,5 palavras/s, beats de 1,2-1,5s)
- Padrão de pipeline reutilizável em futuros projetos de transformação

Por que não as outras:
- VarB: excelente fidelidade mas transição lenta dificulta acompanhar narração
- VarC: bom zoom mas demanda mais tempo total que objetivo do briefing
- VarD: muito minimalista perde detalhes técnicos importantes (API names, register IDs)

### Sugestão de híbrido (opcional)

Se desejar combinar melhores elementos de múltiplas variações:
- Manter fluxo linear de VarA
- Aplicar FocusDim de VarD entre beats para reduzir carga cognitiva
- Usar SplitComparison de VarB apenas no beat de comparação específica

## Perguntas objetivas para decisão

1. Prefere clareza causal máxima (VarA) ou fidelidade técnica detalhada (VarB/C)?
2. Aceita duração ligeiramente maior (75s) para melhorar precisão técnica, ou prefere manter 60s mesmo perdendo detalhes?
3. Gostaria de testar híbrido sugerido ou escolher um padrão puro?

## Próximos passos

Aguardo sua escolha para prosseguir:
- ✅ Escolha de VarX puro → refinar aquela variação específica
- 🔄 Híbrido → combinar componentes selecionados de duas variações
- ❌ Pedido de ajustes → explicar quais critérios estão insatisfatórios
```

## Fluxo de Decisão

1. **Apresentar tabela completa**: nunca esconder pontuações baixas, transparência constrói confiança
2. **Explicar raciocínio**: justificar pedagogicamente por que X ganhou, não apenas números
3. **Oferecer alternativa híbrida**: às vezes usuário quer o melhor de dois mundos
4. **Respeitar preferência do criador**: ele conhece melhor seu público-alvo que você
5. **Documentar decisão final**: registrar em DECISIONS.md qual variação escolhida e motivo exato

Registra sempre no BRIEF.md ou DECISIONS.md:
```markdown
## Variação escolhida
- Nome: VarA_FluxoLinear
- Nota ponderada: 4.1 / 5.0
- Motivo pedagógico principal: máxima clareza de causalidade sequencial
- Descartadas: VarB (ritmo inadequado), VarC (duração excessiva), VarD (pouca fidelidade)
- Premissas: [lista de valores assumidos]
```

