import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextareaProps extends Omit<TextFieldProps, 'multiline' | 'rows'> {
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  rows = 4,
  ...props 
}) => {
  return (
    <TextField
      multiline
      rows={rows}
      variant="outlined"
      {...props}
    />
  );
};
