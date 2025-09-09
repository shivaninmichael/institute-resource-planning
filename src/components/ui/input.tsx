import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'error' | 'fullWidth'> {
  error?: boolean;
  fullWidth?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

export const Input: React.FC<InputProps> = ({ 
  error = false, 
  fullWidth = false, 
  ...props 
}) => {
  return (
    <TextField
      error={error}
      fullWidth={fullWidth}
      variant="outlined"
      {...props}
    />
  );
};
