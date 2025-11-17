import React from 'react';
import { siteConfig } from '@/config/site.config';

type TextVariant = 'h1' | 'h2' | 'h3' | 'paragraph' | 'link';

interface TextProps {
  variant: TextVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: 'text1' | 'text2' | 'accent1' | 'accent2' | 'accent3' | string;
  href?: string;
}

export const Text: React.FC<TextProps> = ({ 
  variant, 
  children, 
  className = '', 
  style = {},
  color,
  href,
}) => {
  const config = siteConfig.typography[variant];
  const baseClassName = config.className;
  const baseStyle = config.style;
  
  // Determine text color
  const textColor = color 
    ? (color in siteConfig.colors 
        ? siteConfig.colors[color as keyof typeof siteConfig.colors] 
        : color)
    : undefined;

  const combinedStyle = {
    ...baseStyle,
    ...style,
    ...(textColor && { color: textColor }),
  };

  const combinedClassName = `${baseClassName} ${className}`.trim();

  // For links
  if (variant === 'link' && href) {
    return (
      <a 
        href={href} 
        className={combinedClassName} 
        style={combinedStyle}
      >
        {children}
      </a>
    );
  }

  // For headings and paragraphs
  const Tag = variant === 'paragraph' ? 'p' : variant as keyof JSX.IntrinsicElements;

  return (
    <Tag className={combinedClassName} style={combinedStyle}>
      {children}
    </Tag>
  );
};

