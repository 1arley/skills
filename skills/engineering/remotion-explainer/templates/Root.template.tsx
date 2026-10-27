// templates/Root.template.tsx
// Estrutura organizacional do projeto Remotion com pastas padronizadas
// Seguir esta organização para facilitar manutenção e navegação

import {Folder, AbsoluteFill} from 'remotion';
import {PilotComposition} from './PilotComposition';
import {calculateMetadata, type MyVideoProps} from './VariationsMatrix';

// Esta é a raiz que será exportada pelo CLI do Remotion
export const RemotionRoot = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0d0d1a'}}>
      {/* 
        Folders organizam composições em hierarquia visual no Studio
        Cada número indica ordem de exibição e grupo lógico
      */}
      
      {/* 01-Piloto: Composição piloto de 5-10s verificando tokens/direção visual */}
      <Folder name="01-Piloto">
        <PilotComposition />
      </Folder>
      
      {/* 02-Variacoes: Rascunhos de variações pedagógicas (antes/depois, fluxo linear, etc) */}
      <Folder name="02-Variacoes">
        {/* VarA_FluxoLinear: sequência causal passo a passo */}
        <Folder name="VarA_FluxoLinear">
          {/* Placeholder - implementar quando usuário aprovar direção visual */}
        </Folder>
        
        {/* VarB_ComparacaoParalela: comparação lado a lado antes/depois */}
        <Folder name="VarB_ComparacaoParalela">
          {/* Placeholder */}
        </Folder>
        
        {/* VarC_ZoomHierarquico: visão macro→zoom progressivo */}
        <Folder name="VarC_ZoomHierarquico">
          {/* Placeholder */}
        </Folder>
        
        {/* VarD_MinimalistaFoco: menos elementos, impacto máximo */}
        <Folder name="VarD_MinimalistaFoco">
          {/* Placeholder */}
        </Folder>
        
        {/* 99-Arquivo: Variações descartadas movidas pra arquivo após escolha */}
        <Folder name="99-Arquivo">
          {/* Exemplo: Unused_VarE_OptionalReference */}
        </Folder>
      </Folder>
      
      {/* 03-Cenas-Isoladas: Cenas testadas individualmente sem narração sincronizada */}
      <Folder name="03-Cenas-Isoladas">
        {/* Beat por beat isolado para revisão independente */}
        <Folder name="Beat_01_Introducao">
          {/* Componente específico deste beat */}
        </Folder>
        
        <Folder name="Beat_02_ExemploVisual">
          {/* Componente específico deste beat */}
        </Folder>
        
        <Folder name="Beat_03_Transformacao">
          {/* Componente específico deste beat */}
        </Folder>
      </Folder>
      
      {/* 04-Master-Sincronizado: Composição final com narração sincronizada via AudioSyncMap.ts */}
      <Folder name="04-Master-Syncronizado">
        {/* Master Composition importará todas cenas validadas + áudio */}
        {/* Duração derivada de getAudioDurationInSeconds() ou calculateMetadata() */}
      </Folder>
      
      {/* 99-Arquivo: Código antigo descartado mantido como referência */}
      <Folder name="99-Arquivo">
        {/* Antiga abordagem que pode ser útil como exemplo */}
      </Folder>
    </AbsoluteFill>
  );
};

