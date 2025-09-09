import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'outline' | 'ghost' | 'text' | 'contained' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  ...props 
}) => {
  // Map custom variants to MUI variants
  const getMuiVariant = (variant: string) => {
    switch (variant) {
      case 'default':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'ghost':
      case 'text':
        return 'text';
      default:
        return variant as 'text' | 'outlined' | 'contained';
    }
  };

  // Map custom sizes to MUI sizes
  const getMuiSize = (size: string) => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      default:
        return size as 'small' | 'medium' | 'large';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant(variant)}
      size={getMuiSize(size)}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
