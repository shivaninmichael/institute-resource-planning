import React from 'react';
import { FormLabel, FormLabelProps } from '@mui/material';

interface LabelProps extends FormLabelProps {
  htmlFor?: string;
}

export const Label: React.FC<LabelProps> = ({ 
  htmlFor,
  children,
  ...props 
}) => {
  return (
    <FormLabel
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </FormLabel>
  );
};
