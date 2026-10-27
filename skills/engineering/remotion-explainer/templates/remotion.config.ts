// templates/remotion.config.ts
// Configuração do projeto Remotion - espelha perfis de render CLI
// Referenciar em scripts/render-profiles.sh quando executar renders

import {Config} from '@remotion/cli/config';

// Perfil MASTER (default): alta qualidade para DaVinci Resolve
Config.setCodec('h264');
Config.setCrf(16); // Alta qualidade, baixo compression artifact
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setHardwareAcceleration('if-possible');

// Para perfis alternativos, definir no momento do render via flags CLI:
// --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png (alpha pass)
// --scale=0.5 --crf=28 (preview rápido)

// Recomendações:
// - CRF 16 ideal para master editável (qualidade excelente)
// - bt709 padrão HDTV compatível com Resolve
// - Se GPU disponível, if-possible acelera encode significativamente
// - Usar ProRes 4444 somente quando precisar alpha channel para overlays

export default {};

