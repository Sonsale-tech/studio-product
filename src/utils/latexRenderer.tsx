import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders plain text with embedded LaTeX formulas:
 * Supports:
 * - Inline: \( ... \) or $ ... $
 * - Display / Block: \[ ... \] or $$ ... $$
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text into regular text and LaTeX segments
  const parseLatex = (rawText: string) => {
    const parts: { type: 'text' | 'math-inline' | 'math-display'; content: string }[] = [];
    
    // Regex matching display math \[...\] or $$...$$ and inline math \(...\) or $...$
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+\$|\\\([\s\S]*?\\\))/g;
    
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      const matchStart = match.index;
      const matchEnd = regex.lastIndex;

      // Add preceding plain text
      if (matchStart > lastIndex) {
        parts.push({
          type: 'text',
          content: rawText.substring(lastIndex, matchStart),
        });
      }

      const rawFormula = match[0];
      if (rawFormula.startsWith('$$') && rawFormula.endsWith('$$')) {
        parts.push({
          type: 'math-display',
          content: rawFormula.slice(2, -2).trim(),
        });
      } else if (rawFormula.startsWith('\\[') && rawFormula.endsWith('\\]')) {
        parts.push({
          type: 'math-display',
          content: rawFormula.slice(2, -2).trim(),
        });
      } else if (rawFormula.startsWith('\\(') && rawFormula.endsWith('\\)')) {
        parts.push({
          type: 'math-inline',
          content: rawFormula.slice(2, -2).trim(),
        });
      } else if (rawFormula.startsWith('$') && rawFormula.endsWith('$')) {
        parts.push({
          type: 'math-inline',
          content: rawFormula.slice(1, -1).trim(),
        });
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < rawText.length) {
      parts.push({
        type: 'text',
        content: rawText.substring(lastIndex),
      });
    }

    return parts;
  };

  const parts = parseLatex(text);

  return (
    <span className={`inline-block ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        }

        try {
          const isDisplay = part.type === 'math-display';
          const html = katex.renderToString(part.content, {
            displayMode: isDisplay,
            throwOnError: false,
            output: 'htmlAndMathml',
          });

          return (
            <span
              key={index}
              className={isDisplay ? 'block my-2 text-center' : 'inline-block px-1'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="text-red-500 font-mono text-xs">
              {part.content}
            </span>
          );
        }
      })}
    </span>
  );
};
