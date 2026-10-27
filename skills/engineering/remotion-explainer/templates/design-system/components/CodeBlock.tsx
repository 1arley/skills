// src/design-system/components/CodeBlock.tsx
// Bloco estilizado para exibir código/snippets com fonte monoespaçada

import {COLORS, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS, SPACING} from '../tokens';

interface CodeBlockProps {
  code: string;
  language?: 'typescript' | 'javascript' | 'bash' | 'json';
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({code, language, style}) => {
  return (
    <pre
      style={{
        fontFamily: FONT_FAMILY.codeMono,
        fontSize: FONT_SIZE.code,
        backgroundColor: COLORS.surfaceCard,
        borderRadius: BORDER_RADIUS.medium,
        padding: SPACING.lg,
        margin: 0,
        overflowX: 'auto',
        color: COLORS.textSecondary,
        lineHeight: 1.5,
        ...style,
      }}
    >
      <code>{code}</code>
    </pre>
  );
};

