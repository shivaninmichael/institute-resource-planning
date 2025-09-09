import React from 'react';
import { 
  Card as MuiCard, 
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Typography,
  CardProps as MuiCardProps 
} from '@mui/material';

interface CardProps extends MuiCardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <MuiCard className={className} {...props}>
      {children}
    </MuiCard>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <MuiCardHeader className={className}>
      {children}
    </MuiCardHeader>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className 
}) => {
  return (
    <Typography variant="h6" component="div" className={className}>
      {children}
    </Typography>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className 
}) => {
  return (
    <MuiCardContent className={className}>
      {children}
    </MuiCardContent>
  );
};
