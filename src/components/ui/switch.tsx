import React from 'react';
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@mui/material';

interface SwitchProps extends Omit<MuiSwitchProps, 'onCheckedChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ 
  onCheckedChange,
  ...props 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  return (
    <MuiSwitch
      onChange={handleChange}
      {...props}
    />
  );
};
