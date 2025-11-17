import React from 'react';
import { siteConfig } from '@/config/site.config';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  bgColor?: string;
  textColor?: string;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  children, 
  onClick,
  className = '', 
  style = {},
  bgColor,
  textColor,
  href,
}) => {
  const config = siteConfig.buttons[variant];
  const baseClassName = config.className;
  const baseStyle = config.style;

  // Determine colors from config
  const backgroundColor = bgColor || (variant === 'primary' ? siteConfig.colors.accent1 : 'transparent');
  const color = textColor || (variant === 'primary' ? '#ffffff' : siteConfig.colors.text1);
  const borderColor = variant === 'secondary' ? siteConfig.colors.accent1 : 'transparent';

  const combinedStyle = {
    ...baseStyle,
    ...style,
    backgroundColor,
    color,
    ...(variant === 'secondary' && { borderColor }),
  };

  const combinedClassName = `${baseClassName} ${className}`.trim();

  if (href) {
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

  return (
    <button 
      onClick={onClick}
      className={combinedClassName} 
      style={combinedStyle}
    >
      {children}
    </button>
  );
};

interface AppStoreButtonProps {
  platform: 'apple';
  href?: string;
  className?: string;
}

export const AppStoreButton: React.FC<AppStoreButtonProps> = ({ 
  platform,
  href = '#',
  className = '',
}) => {
  const config = siteConfig.buttons.appStore;
  const platformConfig = config[platform];
  const icon = siteConfig.icons.apple;

  const combinedStyle = {
    ...config.style,
    backgroundColor: '#000000',
    color: '#ffffff',
  };

  return (
    <a 
      href={href}
      className={`${config.className} ${className}`.trim()}
      style={combinedStyle}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-90">Download on the</span>
        <span className="text-sm font-bold">App Store</span>
      </div>
    </a>
  );
};

