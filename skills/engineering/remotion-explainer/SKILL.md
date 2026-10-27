---
name: remotion-explainer
description: Cria animações explicativas em Remotion (React + TypeScript) a partir de uma explicação técnica, com piloto, design system, variações, sincronia com narração e render para DaVinci Resolve. Use quando o usuário pedir animação explicativa, diagrama animado, cena de vídeo educativo, motion graphics programático, ou mencionar Remotion, narração sincronizada ou exportar para o Resolve.
---

# Motion Design Programático no Remotion

Transforme explicações técnicas complexas em animações didáticas, prontas para pós-produção no DaVinci Resolve.

## Ativação

Use automaticamente quando detectar que o usuário precisa criar animações educacionais com Remotion. Não bloqueie; registre premissas assumidas e prossiga.

## Fluxo iterativo (etapas 0–6)

### Etapa 0: Memória e intake

1. Leia DECISIONS.md de projetos anteriores (**/DECISIONS.md). Resuma o que será reaproveitado (componentes, molas, durações, erros a evitar) em até 10 linhas.
2. Faça uma única rodada de perguntas, cada uma com valor padrão:
   - Tema e objetivo da animação. Padrão: descreva no contexto.
   - Público e nível de conhecimento prévio. Padrão: leigo interessado.
   - Duração alvo (segundos). Padrão: 60-90 s.
   - fps e resolução da timeline do DaVinci Resolve. Padrão: 30 fps, 1920×1080.
   - Idioma do texto na tela. Padrão: PT-BR.
   - Narração: roteiro, áudio pronto ou nada ainda.
   - Referências visuais (prints, vídeos, links).
3. Sem resposta, use padrões e registre como premissas no BRIEF.md.

**Aceite:** BRIEF.md criado a partir de templates/BRIEF.template.md com premissas explícitas.

[CHECKPOINT CP1 - NÃO PARAR] envie o brief resumido e confirme "OK" para prosseguir.

### Etapa 1: Ambiente

1. Verifique Node.js ≥ 16. Inicialize TypeScript em src/. Instale pacotes Remotion na mesma versão exata: remotion, @remotion/cli, @remotion/transitions, @remotion/paths, @remotion/shapes, @remotion/google-fonts, @remotion/media-utils, @remotion/install-whisper-cpp, @remotion/bundler, @remotion/studio, @remotion/eslint-plugin. Fixe versões sem ^ no package.json.
2. Instale Lucide React e configure ESLint com @remotion/eslint-plugin.
3. Inicie Remotion Studio (npx remotion studio) em background ou peça ao criador abrir.

**Aceite:** npx tsc --noEmit sem erros, Studio abrindo, um still gerado por npx remotion still PilotComposition --frame=0 out/audit/pilot-still.png.

[CHECKPOINT CP2 - NÃO PARAR] mostre evidências (tsc, lint, still) e liste o nome da composição no Studio.

### Etapa 2: Briefing pedagógico e Composição Piloto

Escreva no BRIEF.md:
- Objetivo pedagógico mensurável ("ao final, o espectador consegue explicar X").
- Equívoco principal a desfazer.
- Máquina de estados visuais em tabela (beat, estado inicial, evento, estado final, elementos novos ≤4, frase da narração, duração em segundos).
- Orçamento de duração total (frames = round(segundos × fps)). Cada beat tem duração mínima = max(1,2 s, palavrasNaTela ÷ 3,5).

Regra da Composição Piloto: crie um piloto de 5-10 s com paleta/typografia propostas, uma transição completa de estados, um conector animado e destaque de foco. Consuma tokens reais do design system (src/design-system/). Nunca codifique o vídeo inteiro antes disso.

**Aceite:** tsc sem erros, auditoria por stills concluída (início/fim do piloto, meio da transição, frame de destaque), teste dos 5 segundos passando (um frame-chave por 5 s revela qual é a ideia da cena).

[CHECKPOINT 1 - PAUSA OBRIGATÓRIA] envie:
- O que foi feito (um parágrafo).
- Onde ver (nome da composição no Studio + imagens da auditoria por stills).
- Evidências: tsc/lint limpos.
- Duas perguntas objetivas: ritmo geral da narração (pausado/rápido) e densidade de informação (leve/densamente textual).
- Prossiga para direção visual após aprovação.

### Etapa 3: Direção visual e design system

Analise referências multimodalmente (cada print/vídeo extraia valores medidos): hierarquia espacial, proporções entre elementos, espessura/style de setas, densidade de texto, contraste do fundo. Sem referências, proponha dois moodboards textuais, escolha um e registre a escolha como premissa.

Crie design system próprio (src/design-system/) onde nenhuma cena usa cor/tamanho/mola/duração literal:
- tokens.ts: paleta semântica (fundo profundo, superfícies, idle, active, success, warning, error, focus, dim); tipografia (sans-serif geométrica para conceitos, monoespaçada para código), espaçamento múltiplos de 8 px, raios, sombras, margem de segurança 96 px.
- springs.ts: presets SPRING_SNAPPY, SPRING_SMOOTH, SPRING_BOUNCY usando spring({ frame, fps, config }). Valores base: smooth damping 200; snappy damping 20, stiffness 200, mass 0.8; bouncy damping 8. Registre no DECISIONS.md.
- timing.ts: entrada de elemento ~0,6 s; stagger ~0,2 s; antecipação visual da narração ~0,12 s. Converta para frames por fps.
- components/: NodeBox, AnimatedArrow (evolvePath de @remotion/paths), StateBadge, SplitComparison, FocusDim, Callout, CodeBlock, Cursor.

Legibilidade 1080p: corpo ≥36 px, rótulos ≥28 px, código ≥30 px, mínimo 24 px. Contraste ≥4,5:1 (≥7:1 para texto fino). Máximo três cores de destaque por cena, cada uma com significado fixo.

**Aceite:** grep -rnE "#[0-9a-fA-F]{3,8}" src/scenes retorna vazio.

### Etapa 4: Variações, revisão e refinamento

Quando gerar variações (conceito abstrato ou solicitação): todas compartilham os mesmos dados (scene-data.ts), mesmo timing, mesmos componentes. Só muda estratégia de layout/revelação. Registre hipóteses em comentários.

Variações rascunháveis:
- VarA_FluxoLinear: causa→efeito passo a passo com setas conectadas.
- VarB_ComparacaoParalela: antes/depois lado a lado.
- VarC_ZoomHierarquico: macro→zoom no componente que muda.
- VarD_MinimalistaFoco: menos elementos, tipografia impactante.

Rubrica de pontuação (1-5): clareza de causa/efeito (30%), carga cognitiva (25%), fidelidade técnica (20%), ritmo com narração (15%), reaproveitamento no design system (10%). Apresente nota ponderada e recomendação. O criador decide.

Auditoria de refinamento: tamanhos mínimos/contraste, respiração (stagger controlado, beats respeitam tempo mínimo), conexões legíveis (rótulos nas setas), foco único (um movimento principal por vez; resto FocusDim).

**Aceite:** variação escolhida polida, tsc/stills sem pendências, outras movidas para <Folder name="99-Arquivo">.

[CHECKPOINT 2 - PAUSA OBRIGATÓRIA] apresente tabela de pontuação, recomendação e mudanças no refinamento. Avançar só com escolha do criador.

### Etapa 5: Sincronização cirúrgica com a narração (public/)

Ao aprovar direção visual, trave à locução:
1. Carregue áudio de public/ com <Audio src={staticFile("narration.wav")} />.
2. Gere cues via scripts/transcribe-narration.mjs (Whisper via @remotion/install-whisper-cpp). Saída: public/narration.cues.json com palavra, timestamps, estimated: true/false. Sem áudio ainda, estime (≈2,5 palavras/s em PT-BR) e marque // TODO(sync).
3. Mapeie cada beat a um cue em AudioSyncMap.ts (única fonte de tempo): FPS, secToFrame(label), LEAD_FRAMES (12 frames). Nenhum número de frame literal fora daqui.
4. Derive duração master do áudio com getAudioDurationInSeconds (getMediaMetadata() via Mediabunny quando disponível). Se narração for regravada, regere JSON e CUE; o vídeo se reorganiza sozinho.

**Aceite:** stills nos frames das cues mostram o evento certo; grep -nE "from=\{[0-9]+" src retorna vazio.

[CHECKPOINT 3 - PAUSA OBRIGATÓRIA] o criador ouve no Studio com áudio e anota desvios. Ajuste apenas AudioSyncMap.ts.

### Etapa 6: Render, validação e registro

Perfis de render:
- preview: npx remotion render Master out/preview.mp4 --scale=0.5 --crf=28
- master: npx remotion render Master out/master.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --hardware-acceleration=if-possible --muted
- alpha: npx remotion render Master out/master-alpha.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted

Regras do render: confira flags com --help da versão instalada; espelhe perfil master em remotion.config.ts. Use --muted quando mixar narração no Resolve. Para 4K, mantenha 1080p e use --scale=2. Meça ganho de GPU (--frames=0-120 em concorrência 50-100%) e registre no DECISIONS.md. Se Resolve não importar H.264, renderize ProRes.

Validação: ffprobe confirma codec, fps igual à timeline, resolução, pix_fmt, duração ±1 frame, número de frames igual a durationInFrames. Abertura do primeiro/último frame.

Checagem no editor: importar na timeline do Resolve e verificar sem conversão de framerate, nitidez em zoom 100% (texto/conectores), cores batendo, animação alinhada à narração, bordas limpas no perfil alpha.

Documentação obrigatória: crie/atualize DECISIONS.md na raiz a partir do modelo (objetivo pedagógico, variação escolhida e pontuação, física/timing, componentes novos promovidos, soluções visuais, problemas resolvidos, render, premissas). Promova componentes listados para design system global. A Etapa 0 de próximos vídeos lerá este arquivo.

## Hard rules (nunca ignorar)

1. Animação é função pura do frame. Nada de transition-* ou animate-* (CSS/Tailwind), setTimeout/setInterval/requestAnimationFrame, Date.now(), Framer Motion. Apenas useCurrentFrame().
2. Sem Math.random(); use random("seed") do Remotion.
3. Todo interpolate deve levar extrapolateLeft/right clamp, salvo documentado.
4. Dimensões/fps vêm de useVideoConfig(). Não escrever literais 1920, 1080, 30 em cenas.
5. Assets determinísticos: staticFile(), <Img>, <Audio>, <OffthreadVideo>. Fontes via @remotion/google-fonts ou @remotion/fonts. Qualquer carregamento assíncrono usa delayRender()/continueRender()/cancelRender().
6. Sequences: useCurrentFrame() relativo ao início da sequência. Use premountFor. Em TransitionSeries, recalcule total (transições sobrepõem).
7. Molas com duração previsível: passe fps e, quando necessário, durationInFrames. Use measureSpring para saber fim.
8. Conectores SVG: anime com evolvePath/getLength de @remotion/paths; não anime d por CSS.
9. Evite box-shadow grande e filter: blur em muitos elementos simultâneos.
10. Todas as versões remotion/@remotion/* idênticas (sem ^).
11. Organização do Root.tsx: <Folders> 01-Piloto, 02-Variacoes, 03-Cenas-Isoladas, 04-Master-Sincronizado, 99-Arquivo.
12. Lint: @remotion/eslint-plugin ativo; tsc --noEmit e lint limpos antes de cada checkpoint.

## Auditoria por stills

Antes de cada checkpoint, renderize npx remotion still <Comp> --frame=N --output=out/audit/<nome>.png nos frames: início/fim de cada beat, meio de transição, frame de cada cue. Confira texto cortado, sobreposição, contraste, alinhamento. Corrija antes de pedir aprovação.

Testes de qualidade pedagógica:
- 5 segundos: frame-chave por 5 s → dá para dizer a ideia?
- Mudo: assista sem narração → faz sentido?
- Distraído: tela pequena → rótulos legíveis e foco óbvio?
- Carga cognitiva: ≤4 elementos novos por beat, um movimento principal.

Anti-padrões a evitar: tela cheia de texto, tudo aparecendo juntos, setas sem rótulo, duas animações competindo, >3 cores de destaque, easing linear em interface, acelerar animação para caber na fala, códigos todo vídeo inteiro antes do CP1, valores mágicos.

## Entregáveis agora e ordem de geração

Gere nesta ordem, validando cada passo:
1. SKILL.md completo (este documento).
2. references/ workflow-checkpoints.md, pedagogy-rules.md, design-system-spec.md, variations-rubric.md, audio-sync-guide.md, remotion-hard-rules.md, render-and-resolve-guide.md, pedagogical-patterns.md.
3. templates/ design-system (tokens.ts, springs.ts, timing.ts, components/), AudioSyncMap.ts, PilotComposition.tsx, VariationsMatrix.tsx, Root.template.tsx, remotion.config.ts, BRIEF.template.md, DECISIONS.template.md.
4. scripts/ init-remotion-workspace.sh, transcribe-narration.mjs, still-audit.sh, render-profiles.sh, log-decisions.sh.

Autoteste final: simule fluxo com briefing exemplo ("como chamadas de sistema de console são traduzidas para API Windows numa recompilação estática"), rode npx tsc --noEmit nos templates e liste falhas. Corrija. Reporte com checklist de definição de pronto (frontmatter válido ≤500 linhas, todos os templates compilam, scripts idempotentes com mensagens claras, teste ponta-a-ponta gera piloto sem intervenção além do CP1).
