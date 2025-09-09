import React from 'react';
import { 
  Dialog as MuiDialog, 
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  Typography
} from '@mui/material';

interface DialogProps extends MuiDialogProps {
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ 
  children,
  ...props 
}) => {
  return (
    <MuiDialog {...props}>
      {children}
    </MuiDialog>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return (
    <MuiDialogTitle>
      <Typography variant="h6" component="div">
        {children}
      </Typography>
    </MuiDialogTitle>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  return (
    <MuiDialogContent>
      {children}
    </MuiDialogContent>
  );
};
