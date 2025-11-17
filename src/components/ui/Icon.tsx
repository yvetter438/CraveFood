import React from 'react';
import { siteConfig } from '@/config/site.config';

type IconName = keyof typeof siteConfig.icons;

interface IconProps {
  name: IconName;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = '1.5rem',
  className = '', 
  style = {},
}) => {
  const icon = siteConfig.icons[name];

  const combinedStyle = {
    fontSize: size,
    ...style,
  };

  return (
    <span 
      className={`inline-block ${className}`.trim()} 
      style={combinedStyle}
      role="img"
      aria-label={name}
    >
      {icon}
    </span>
  );
};

