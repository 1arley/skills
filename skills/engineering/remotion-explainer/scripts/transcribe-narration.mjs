#!/usr/bin/env node
/**
 * scripts/transcribe-narration.mjs
 * Transcreve áudio de narração usando Whisper.cpp @remotion/install-whisper-cpp
 * Gera public/narration.cues.json com timestamps word-level
 * 
 * Uso:
 *   node scripts/transcribe-narration.mjs
 *   
 * Pré-requisitos:
 * - Áudio em public/narracao.wav (16-bit, 16kHz, mono)
 * - Whisper.cpp instalado (versão ≥ 1.5.5 para token-level timestamps)
 */

import {transcribe, installWhisperCpp, downloadWhisperModel} from '@remotion/install-whisper-cpp';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

/**
 * Determina qual cue label usar para agrupamento semântico de palavras
 * Agrupa palavras que formam uma frase completa
 */
function determineCueLabel(wordText, index, allWords) {
  // Palavras terminando com pontuação marcam fim de frase
  if (wordText.endsWith('.') || wordText.endsWith('!') || wordText.endsWith('?')) {
    return `frase_${index}`;
  }
  
  // Se for primeira palavra após espaço significativo, nova frase
  const prevWord = index > 0 ? allWords[index - 1].text : '';
  if (prevWord && !prevWord.endsWith(' ') && !prevWord.endsWith('.')) {
    return `frase_${Math.floor(index / 3)}_part2`; // heuristic simples
  }
  
  return `palavra_${index}`;
}

/**
 * Converte tempo HH:MM:SS:FF para milissegundos
 * Formato esperado do Whisper: "00:00:01,234"
 */
function parseTimestamp(timestampStr) {
  const [timeMs] = timestampStr.split(',');
  const parts = timeMs.split(':').map(Number);
  
  // parts = [hours, minutes, seconds, milliseconds]
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  const seconds = parts[2] || 0;
  const ms = parts[3] || 0;
  
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + ms;
}

/**
 * Transcreve arquivo de áudio e gera cues JSON
 */
async function transcribeNarration() {
  console.log('🎙️  Iniciando transcrição de narração...');
  
  const audioPath = join(PUBLIC_DIR, 'narracao.wav');
  
  // Verificar se áudio existe
  try {
    readFileSync(audioPath);
    console.log(`✅ Áudio encontrado: ${audioPath}`);
  } catch (err) {
    console.error(`❌ ERRO: Arquivo de áudio não encontrado em ${audioPath}`);
    console.log('\n⚠️  Soluções:');
    console.log('1. Copie seu áudio para public/narracao.wav');
    console.log('2. Ou resample MP3/OGG para WAV 16-bit 16kHz:');
    console.log('   ffmpeg -i input.mp3 -ar 16000 -ac 1 -bit_depth 16 public/narracao.wav');
    process.exit(1);
  }
  
  // Instalar Whisper.cpp se não existir
  const whisperPath = join(PROJECT_ROOT, 'whisper.cpp');
  if (!require('fs').existsSync(whisperPath)) {
    console.log('📥 Instalando Whisper.cpp...');
    await installWhisperCpp({
      version: '1.5.5',
      to: whisperPath,
    });
    console.log('✅ Whisper.cpp v1.5.5 instalado em whisper.cpp/');
  } else {
    console.log('ℹ️  Whisper.cpp já instalado.');
  }
  
  // Baixar modelo se necessário
  const modelPath = join(whisperPath, 'models', 'medium.en.bin');
  if (!require('fs').existsSync(modelPath)) {
    console.log('📥 Baixando modelo medium.en (PT-BR)...');
    await downloadWhisperModel({
      model: 'medium.en',
      folder: join(whisperPath, 'models'),
    });
    console.log('✅ Modelo baixado para whisper.cpp/models/medium.en.bin');
  } else {
    console.log('ℹ️  Modelo medium.en já existente.');
  }
  
  // Realizar transcrição com timestamps word-level
  console.log('🔄 Transcrevendo... Isso pode levar alguns minutos dependendo do tamanho do áudio.');
  
  const transcriptionResult = await transcribe({
    inputPath: audioPath,
    whisperPath,
    whisperCppVersion: '1.5.5',
    model: 'medium.en',
    tokenLevelTimestamps: true, // Essencial para timing preciso por palavra
    language: null,             // null = auto-detect language, ou especificar 'Portuguese'
    splitOnWord: true,          // Limpo, um token por item
    printOutput: false,         // Silencioso para pipeline CI
  });
  
  // Estruturar resultado no formato esperado pelo projeto
  const cues = {
    words: transcriptionResult.transcription.map((item, idx) => ({
      index: idx,
      text: item.text.trim(),
      fromMs: parseTimestamp(item.timestamps.from),
      toMs: parseTimestamp(item.timestamps.to),
      estimated: false,              // ← Falso porque Whisper gerou
      cueLabel: determineCueLabel(item.text, idx, transcriptionResult.transcription),
    })),
    totalDurationSeconds: parseFloat(transcriptionResult.result.duration) || 0,
  };
  
  // Escrever arquivo JSON público
  const outputPath = join(PUBLIC_DIR, 'narration.cues.json');
  writeFileSync(outputPath, JSON.stringify(cues, null, 2));
  console.log(`\n✅ Transcrição concluída: ${cues.words.length} palavras em ${cues.totalDurationSeconds.toFixed(1)} segundos`);
  console.log(`📄 Cues salvos em: ${outputPath}`);
  
  // Exibir preview dos primeiros cues
  console.log('\n👀 Preview dos primeiros 5 cues:');
  cues.words.slice(0, 5).forEach(word => {
    console.log(`   [${word.fromMs}ms → ${word.toMs}ms] "${word.text}" (${word.cueLabel})`);
  });
  
  return cues;
}

/**
 * Modo fallback: estimar cues manualmente sem áudio (quando apenas roteiro disponível)
 */
function estimateCuesFromScript(scriptText, speedPPS = 2.5) {
  const palavras = scriptText.split(/\s+/).filter(Boolean);
  const avgWordDurationMs = 1000 / speedPPS; // ≈400ms/palavra para PT-BR
  
  let acumuladoMs = 0;
  
  return palavras.map((palavra, idx) => {
    const cueLabel = determineCueLabel(palavra, idx, palavras);
    const isLastWord = idx === palavras.length - 1;
    
    const wordEntry = {
      index: idx,
      text: palavra,
      fromMs: acumuladoMs,
      toMs: isLastWord 
        ? palavras.length / speedPPS * 1000  // Finalizar no total estimado
        : acumuladoMs + avgWordDurationMs,
      estimated: true,                     // ← Verdadeiro porque estimado
      cueLabel,
    };
    
    acumuladoMs = wordEntry.toMs;
    return wordEntry;
  });
}

// Executar transcrição principal
if (require.main === module) {
  transcribeNarration()
    .then(() => {
      console.log('\n🎉 Pronto! Use public/narration.cues.json para mapear beats em AudioSyncMap.ts');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Erro na transcrição:', err.message);
      console.error('\nDica: Execute "npx remotion install-whisper-cpp --version 1.5.5 --to ./whisper.cpp" primeiro.');
      process.exit(1);
    });
}

export default transcribeNarration;

