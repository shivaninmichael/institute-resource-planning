import React from 'react';
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';

interface BadgeProps extends MuiBadgeProps {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children,
  ...props 
}) => {
  return (
    <MuiBadge {...props}>
      {children}
    </MuiBadge>
  );
};
