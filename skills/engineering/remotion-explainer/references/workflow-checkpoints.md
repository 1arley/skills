# Critérios de Aceite e Checkpoints

Esta documentação define os critérios de aceite por etapa e os modelos de mensagem para cada checkpoint no fluxo remotion-explainer.

## Etapa 0: Memória e intake

### Critérios de aceite

1. **Leitura de DECISIONS.md**: O agente deve buscar e ler arquivos **/DECISIONS.md** em projetos anteriores. A leitura deve identificar componentes reutilizáveis, molas configuradas, durações padrão e erros comuns já registrados.

2. **Perguntas únicas**: Um conjunto único de perguntas com valores padrão definidos:
   - Tema e objetivo da animação
   - Público e nível de conhecimento prévio
   - Duração alvo (padrão: 60-90s)
   - fps e resolução do Resolve (padrão: 30fps, 1920×1080)
   - Idioma do texto na tela (padrão: PT-BR)
   - Estado da narração (roteiro, áudio pronto ou nenhum)
   - Referências visuais (prints, vídeos, links)

3. **Registramento de premissas**: Cada valor assumido sem confirmação deve ser registrado como premissa no BRIEF.md.

4. **Geração do BRIEF.md**: O arquivo deve seguir o template templates/BRIEF.template.md com as seguintes seções preenchidas: contexto, objetivo pedagógico, equívoco principal, máquina de estados visuais, orçamento de duração e premissas.

### Modelo de mensagem CP1

```markdown
## O que foi feito
Criação do briefing inicial com premissas definidas para o projeto de animação explicativa sobre [TEMA].

## Onde ver
Arquivo: BRIEF.md na raiz do projeto

## Evidências
- Previsão de perguntas para o criador: tema, público, duração, fps, narração, referências

## Perguntas objetivas
1. O tema está correto ou precisa ajustar?
2. Posso prosseguir com as premissas padronizadas ou há especificações diferentes?

## O que vem a seguir
Etapa 1: Configuração do ambiente Remotion com pacotes e verificações de dependência.
```

## Etapa 1: Ambiente

### Critérios de aceite

1. **Verificação de Node.js**: Confirmar Node.js ≥ 16.0.0 disponível no PATH.

2. **Instalação de pacotes Remotion**: Instalar todas as dependências na mesma versão exata (4.0.539):
   - `remotion`
   - `@remotion/cli`
   - `@remotion/transitions`
   - `@remotion/paths`
   - `@remotion/shapes`
   - `@remotion/google-fonts`
   - `@remotion/media-utils`
   - `@remotion/install-whisper-cpp`
   - `@remotion/bundler`
   - `@remotion/studio`
   - `@remotion/eslint-plugin`

3. **TypeScript configuration**: Criar tsconfig.json com compilerOptions apropriados para React e Remotion.

4. **ESLint setup**: Instalar @remotion/eslint-plugin e configurar rules conforme recommendation do plugin.

5. **Remotion Studio**: Iniciar npx remotion studio em background e verificar abertura bem-sucedida.

6. **Still test**: Gerar um still frame válido usando npx remotion still PilotComposition --frame=0.

### Modelo de mensagem CP2

```markdown
## O que foi feito
Configuração completa do ambiente Remotion com TypeScript, ESLint e pacote de dependências sincronizado.

## Onde ver
Studio: http://localhost:3000 (ou porta designada)

## Evidências
- tsc --noEmit: SUCESSO (0 erros)
- eslint check: SUCESSO (0 warnings)
- Still test: out/audit/pilot-still.png gerado com sucesso
- Pacotes instalados: remotion@4.0.539, @remotion/* alinhados

## Nome da composição no Studio
01-Piloto/PilotComposition

## O que vem a seguir
Etapa 2: Briefing pedagógico detalhado e criação da Composição Piloto.
```

## Etapa 2: Briefing pedagógico e Composição Piloto

### Critérios de aceite

1. **Objetivo pedagógico mensurável**: Declarar claramente "ao final, o espectador consegue explicar X".

2. **Equívoco principal**: Identificar e documentar o conceito errado mais comum sobre o tema.

3. **Máquina de estados visuais**: Tabela estruturada com colunas:
   - Beat (número sequencial)
   - Estado inicial
   - Evento ou transformação
   - Estado final
   - Elementos novos (máximo 4)
   - Frase da narração correspondente
   - Duração em segundos

4. **Orçamento de duração**: Calcular frames totais = round(segundos × fps). Definir duração mínima por beat = max(1,2 s, palavrasNaTela ÷ 3,5).

5. **Composição Piloto**: Implementar uma sequência de 5-10s contendo:
   - Paleta de cores definida em tokens.ts
   - Tipografia proposta consumindo tokens reais
   - Uma transição completa de estados (entrada → transformação → saída)
   - Um conector animado (seta/linha evoluída via evolvePath)
   - Um destaque de foco (dimmer de elementos secundários)

6. **Auditoria por stills**: Renderizar frames-chave:
   - Frame 0: início do piloto
   - Frame N/2: meio da transição
   - Frame N: fim do piloto
   - Frame de destaque do foco

7. **Teste dos 5 segundos**: Apresentar um frame-chave isolado. O observador deve conseguir identificar qual é a ideia central em 5 segundos.

### Modelo de mensagem CP1

```markdown
## O que foi feito
Briefing pedagógico completo com máquina de estados visual e Composição Piloto funcional contendo transição, conectores e sistema de foco.

## Onde ver
Studio: http://localhost:3000
Composição: 01-Piloto/PilotComposition
Stills: out/audit/pilot-{início,fim,transição}.png

## Evidências
- tsc --noEmit: SUCESSO (0 erros)
- Teste dos 5 segundos: [APROVADO/REPROVADO] - [Justificativa curta]
- Todos os beats definidos no BRIEF.md
- Tokens do design system importados no piloto

## Perguntas objetivas
1. Ritmo geral da narração desejado: pausado (1s por beat), moderado (0,75s por beat) ou rápido (0,5s por beat)?
2. Densidade de informação preferida: leve (≤2 elementos novos por beat) ou densamente textual (até 4 elementos)?

## O que vem a seguir
Etapa 3: Direção visual e implementação do design system próprio. Aguardo sua resposta para avançar.
```

[PAUSA OBRIGATÓRIA AGUARDANDO RESPOSTA DO CRIADOR]

## Etapa 3: Direção visual e design system

### Critérios de aceite

1. **Análise multimodal de referências**: Para cada referência visual (print ou vídeo), extrair valores medidos:
   - Hierarquia espacial (distâncias relativas entre elementos principais)
   - Proporções entre elementos (ratios fixos, não porcentagens arbitrárias)
   - Estilo e espessura de conectores/setas (stroke-width específico em px)
   - Densidade de texto (palavras por unidade de área)
   - Contraste do fundo (valores de luminância calculados)

2. **Proposta de moodboards**: Sem referências, apresentar dois moodboards textuais com:
   - Descrição do layout geral
   - Especificação de tipografia (fontes e pesos propostos)
   - Sistema de cores com significado semântico
   - Regras de espaçamento e grid
   - Escolha do usuário registrada como premissa

3. **Tokens.ts implementado**: Arquivo src/design-system/tokens.ts exportando:
   - Paleta semântica completa (fundo, superfícies, idle, active, success, warning, error, focus, dim)
   - Tipografia geométrica sans-serif para conceitos, monoespaçada para código
   - Espaçamento múltiplos de 8px
   - Raios de borda consistentes
   - Sombras com valores de blur específicos
   - Margem de segurança de 96px nos 4 lados

4. **Springs.ts implementado**: Arquivo src/design-system/springs.ts exportando presets:
   - SPRING_SNAPPY: damping 20, stiffness 200, mass 0.8
   - SPRING_SMOOTH: damping 200, stiffness configurável
   - SPRING_BOUNCY: damping 8, stiffness configurável
   - Função spring() configurada para receber { frame, fps, config }
   - Registro de valores finais em DECISIONS.md

5. **Timing.ts implementado**: Arquivo src/design-system/timing.ts exportando:
   - Entrada de elemento: 0,6s (convertido para frames)
   - Stagger entre elementos: 0,2s
   - Antecipação visual da narração: 0,12s (12 frames a 30fps)
   - Conversão automática para frames baseada no FPS atual

6. **Components/ implementados**: Componentes base em src/design-system/components/:
   - NodeBox: caixa animada com estado ativo/passivo
   - AnimatedArrow: seta evoluída via evolvePath(@remotion/paths)
   - StateBadge: badge indicando estado (idle/active/error)
   - SplitComparison: comparação lado a lado antes/depois
   - FocusDim: redutora de opacidade do fundo quando focar elemento
   - Callout: anotador com seta apontando elemento
   - CodeBlock: bloco de código monoespaçado estilizado
   - Cursor: cursor personalizado seguindo movimento mouse (via useCurrentFrame)

7. **Legibilidade verificada**: Garantir tamanhos mínimos:
   - Corpo de texto: ≥36px
   - Rótulos: ≥28px
   - Código: ≥30px
   - Mínimo absoluto: 24px
   - Contraste ≥4,5:1 (≥7:1 para texto fino/light weight)
   - Máximo 3 cores de destaque por cena, cada com significado fixo

8. **Regra de tokens aplicada**: Grep src/scenes buscando literais hexadecimais de cor. Deve retornar vazio. Todas as cores vêm de tokens.ts.

### Modelo de mensagem (antes de CP2)

```markdown
## O que foi feito
Design system próprio completamente implementado com tokens, springs, timing e componentes reutilizáveis. Análise de referências visual extraído valores medidos.

## Onde ver
Diretório: src/design-system/
- tokens.ts: 30+ variáveis de token definidas
- springs.ts: 3 presets configurados e testados
- timing.ts: constantes convertidas para FPS
- components/: 8 componentes básicos prontos

## Evidências
- tsc --noEmit: SUCESSO
- grep "#[0-9a-fA-F]{3,8}" src/scenes: Vazio (nenhum literal hexadecimal)
- Tamanhos mínimos verificados: corpo 36px, labels 28px, code 30px
- Contrastes calculados: mínimo 5,2:1 (padrão 7:1 atingido)

## Premissas registradas
- Moodboard escolhido: [NOME]/[Descrição breve]
- Cores primárias: [listagem]
- Fontes: [sans-serif nome], [mono nome]

## O que vem a seguir
Etapa 4: Geração de variações pedagógicas e seleção por rubrica. Vou preparar rascunhos de VarA_FluxoLinear, VarB_ComparacaoParalela, VarC_ZoomHierarquico e VarD_MinimalistaFoco.
```

[PRÓXIMO CHECKPOINT APÓS IMPLEMENTAÇÃO DE VARIAÇÕES]

## Etapa 4: Variações, revisão e refinamento

### Critérios de aceite

1. **Hipóteses pedagógicas distintas**: Cada variação testa estratégia diferente:
   - VarA_FluxoLinear: sequência temporal linear com setas conectando causa→efeito
   - VarB_ComparacaoParalela: colocação lado a lado antes/depois
   - VarC_ZoomHierarquico: visão macro primeiro, depois zoom progressivo
   - VarD_MinimalistaFoco: redução drástica de elementos, tipografia grande impactante

2. **Dados compartilhados**: Todas usam exatamente o mesmo scene-data.ts, mesmo timing, mesmos tokens.

3. **Layout diferente**: Só muda organização espacial, ordem de entrada, estratégias de revelação.

4. **Comentário de hipótese**: Cada pasta <Folder name="VarX_..."> no Root.tsx tem comentário explicando a hipótese testada.

5. **Rubrica aplicada**: Pontuação 1-5 para cada critério, ponderada:
   - Clareza causa/efeito (30%)
   - Carga cognitiva (25%)
   - Fidelidade técnica (20%)
   - Ritmo narração (15%)
   - Reaproveitamento design system (10%)

6. **Nota ponderada calculada**: Exibir tabela completa com pontuação individual, ponderação e nota final.

7. **Seleção aprovada pelo usuário**: Nenhuma variação é polida sem escolha explícita do criador.

8. **Refinamento auditado**: Variação escolhida passa auditoria:
   - Tamanhos mínimos atendidos
   - Respiração controlada (stagger aplicado, beats respeitam tempo mínimo)
   - Conexões legíveis (todas as setas têm rótulo indicando o que trafega)
   - Foco único (um movimento principal, resto FocusDim)

9. **Variações descartadas movidas**: Movidas para <Folder name="99-Arquivo">, comentários removidos.

### Modelo de mensagem CP2

```markdown
## O que foi feito
Quatro rascunhos de variações pedagógicas implementados, rubrica aplicada, variação escolhida refinada.

## Onde ver
Studio: http://localhost:3000
Composições: 02-Variacoes/VarA_FluxoLinear, ..., 02-Variacoes/VarD_MinimalistaFoco
Arquivo: 02-Variacoes/99-Arquivo/[variações descartadas]

## Tabela de pontuação

| Variação | Clareza (30%) | Carga Cogn (25%) | Fidelidade (20%) | Ritmo (15%) | DS (10%) | Ponderada |
|----------|---------------|------------------|------------------|-------------|----------|-----------|
| VarA     | 4             | 3                | 5                | 4           | 4        | 3.9       |
| VarB     | 5             | 4                | 4                | 4           | 4        | 4.3       |
| VarC     | 4             | 4                | 5                | 3           | 5        | 4.2       |
| VarD     | 3             | 5                | 3                | 5           | 3        | 3.7       |

**Recomendada: VarB_ComparacaoParalela** (nota ponderada: 4.3)

## Por que funcionou melhor pedagogicamente
[Apenas uma frase explicando a decisão]

## Mudanças no refinamento da VarB
1. Aumentei fonte dos rótulos de 24px para 28px (conforme tokens.labels)
2. Adicionei delayRender() até fontes carregarem
3. Stagger ajustado de 0,2s para 0,15s entre elementos paralelos
4. Contra-corrente confirmada: contraste mínimo 6,1:1

## Descartadas e por quê
- VarA: menos clara causalmente (4 vs 5)
- VarC: ritmo não acompanhou narração (3)
- VarD: fidelidade técnica insuficiente (3)

## Pergunta objetiva
Posso prosseguir para Etapa 5 (sincronização com narração) ou deseja ajustes adicionais na variação escolhida?

## O que vem a seguir
Etapa 5: Sincronização cirúrgica com narração usando cues, AudioSyncMap.ts e transcribe-narration.mjs.
```

[PAUSA OBRIGATÓRIA AGUARDANDO RESPOSTA DO CRIADOR]

## Etapa 5: Sincronização cirúrgica com narração

### Critérios de aceite

1. **Áudio carregado**: public/narration.wav ou outro formato suportado referenced via staticFile().

2. **Cues gerados**: scripts/transcribe-narration.mjs executado (ou estimado manualmente se sem áudio). Saída: public/narration.cues.json com estrutura:
```json
{
  "words": [
    {"text": "Olá", "from": "00:00:00:00", "to": "00:00:00:15", "estimated": false}
  ],
  "totalDuration": 45.3
}
```

3. **AudioSyncMap.ts único source of time**: Arquivo exporta:
```typescript
export const FPS = 30; // coincide com timeline do Resolve
export const secToFrame = (sec: number) => Math.round(sec * FPS);
export const LEAD_FRAMES = secToFrame(0.12);
export const CUE = {
  INTRO_PROBLEMA: { label: "Introdução do problema", sec: 0.0, quote: "...", estimated?: true },
  EXPLICA_RECOMPILACAO: { label: "Explica a recompilação", sec: 7.4, quote: "..." },
};
```

4. **Números de frame literais proibidos**: grep -rn "from=\{[0-9]+" src retorna vazio. Todos os frames derivam de CUE.*, secToFrame(), LEAD_FRAMES.

5. **Duração master derivada do áudio**: calculateMetadata usa getAudioDurationInSeconds() ou getMediaMetadata(). Se narração regravada, regera cues e tudo se recalcula.

6. **Antecipação visual aplicada**: Destaque/eventos começam LEAD_FRAMES antes do cue vocal correspondente.

### Modelo de mensagem CP3

```markdown
## O que foi feito
Narrativa sincronizada com cues word-level, AudioSyncMap.ts consolidado como única fonte de tempo, duração master derivada automaticamente do áudio.

## Onde ver
Studio: http://localhost:3000 com áudio carregado
Arquivos: 
- public/narration.wav / narration.mp3
- public/narration.cues.json
- src/AudioSyncMap.ts (FPS, secToFrame, LEAD_FRAMES, CUE_* constantes)
- Out/Master-Sincronizado/sequence durationInFrames == audio duration ±1 frame

## Comportamento observado
- Intro começa 12 frames antes da palavra "Olá" (LEAD_FRAMES antecipação)
- Beats terminam antes das próximas frases na narração (estômago de 0,2s)
- Sequências calculadas: Sequence from={secToFrame(CUE.INICIO.sec)} to={secToFrame(CUE.FIM.sec)}
- Duração total: [X] frames = [Y] segundos

## Desvios identificados pelo criador (se houver)
[Listar anotações do criador: "destaque entra tarde em 00:12", "stagger muito rápido", etc.]

## Ajustes aplicados
[Todos os ajustes feitos em AudioSyncMap.ts]

## Pergunta objetiva
A sincronização está adequada ou preciso ajustar algum timing específico?

## O que vem a seguir
Etapa 6: Render, validação ffprobe, importação no Resolve e registro em DECISIONS.md.
```

[PAUSA OBRIGATÓRIA AGUARDANDO RESPOSTA DO CRIADOR]

## Etapa 6: Render, validação e registro

### Critérios de aceite

1. **Perfis de render executados**:
   - Preview: escala 0.5, CRF 28, rápida revisão
   - Master: codec h264, CRF 16, pixel-format yuv420p, color-space bt709, hardware-acceleration if-possible, muted
   - Alpha: codec prores, profile 4444, pixel-format yuva444p10le, image-format png, muted (para overlay)

2. **Flags validadas com help da versão**: Executar npx remotion render --help e confirmar flags usadas são compatíveis com versão instalada (4.0.539).

3. **Config mirroring**: remotion.config.ts tem defaults equivalentes aos flags do perfil master.

4. **GPU benchmark realizado**: Teste com --frames=0-120 em concorrências 50%, 75%, 100%. Registrar melhor value no DECISIONS.md.

5. **Validação ffprobe**: Executar ffprobe no output e confirmar:
   - Codec correspondente ao esperado
   - FPS igual à timeline do Resolve
   - Resolução correta (1920×1080 ou --scale=2 para 4K)
   - pix_fmt correspondente
   - Duração ±1 frame da narração
   - Número total de frames == durationInFrames

6. **Frame check**: Abrir primeiro e último frame do vídeo renderizado. Verificar cortes não há margem de segurança violada.

7. **Checagem no Resolve**: Checklist preenchido:
   - Resolve não pede conversão de framerate
   - Texto fino e conectores nítidos a 100% zoom
   - Cores batem com Studio (mesma gama)
   - Animação alinhada à narração no ponto de entrada do clipe
   - Perfil alpha: bordas limpas sem halo sobre B-roll

8. **DECISIONS.md criado/atualizado**: Conteúdo obrigatório:
   - Título com data
   - Objetivo pedagógico e equívoco desfeito
   - Variação escolhida (nome, nota ponderada, motivo pedagógico)
   - Física e timing (preset damping/stiffness/mass, durações registradas)
   - Componentes novos promovidos para design system global
   - Soluções visuais reaproveitáveis
   - Problemas e armadilhas enfrentados e resolvidos
   - Render (perfil, concorrência, tempo, GPU ajudou?)
   - Premissas assumidas

9. **Promoção de componentes**: Listar quais componentes devem ser promovidos para design system global e registrar onde copiar.

### Modelo de mensagem Final

```markdown
## O que foi feito
Render completo com três perfis, validação ffprobe e checklist do Resolve preenchido. DECISIONS.md documentado.

## Onde ver
Entregáveis:
- out/preview.mp4 (preview rápida)
- out/master.mp4 (entrega principal para editar)
- out/master-alpha.mov (overlay transparente para camadas)
- DECISIONS.md (documentação completa do projeto)

## Evidências de qualidade
- ffprobe: codec=h264, fps=30, resolution=1920x1080, pix_fmt=yuv420p, duration=[X]s (±0 frames)
- Primeiros/últimos frames abertos: OK (sem cortes, margem segura 96px preservada)
- Render time: [X] min com [N] threads, GPU [AJUDOU/NÃO AJUDOU]

## Cheque list do Resolve
- [ ] Sem conversão de framerate solicitada
- [ ] Nitidez mantida a 100% zoom
- [ ] Cores batem (bt709 confirmado)
- [ ] Narração sincronizada no corte
- [ ] Alpha clean (sem halo)

## COMPONENTES PROMOVIDOS AO DESIGN SYSTEM GLOBAL
[Listar componentes novos que devem ser copiados para global design system]

## PROBLEMAS E SOLUÇÕES REGISTRADAS EM DECISIONS.md
- [Listar problemas encontrados e como foram resolvidos]

## PRÓXIMOS PASSOS
1. Importar out/master.mp4 na timeline do Resolve
2. Mixar narração final se usou --muted
3. Promover componentes listados para global design system
4. Atualizar DECISIONS.md em projetos futuros lendo esta memória

---

Este projeto conclui o ciclo remotion-explainer. A skill agora está ativa para projetos subsequentes através da leitura de DECISIONS.md na Etapa 0.
```

## Checklist de definição de pronto da skill

Antes de considerar a skill pronta, validar:

- [ ] SKILL.md com frontmatter válido e ≤500 linhas
- [ ] Todos templates compilam com npx tsc --noEmit (validado contra v4.0.539)
- [ ] Scripts idempotentes com mensagens de erro claras
- [ ] Pipeline end-to-end testado com briefing exemplo ("console chama API Windows")
- [ ] Três checkpoints implementados com pausa obrigatória (CP1, CP2, CP3)
- [ ] Hard rules incluídas e citadas em references/
- [ ] Auditoria por stills automatizada em scripts/still-audit.sh
- [ ] Rubrica de variações documentada em references/variations-rubric.md
- [ ] Guia de sincronização audio completa em references/audio-sync-guide.md
- [ ] Documentação de render para Resolve em references/render-and-resolve-guide.md

