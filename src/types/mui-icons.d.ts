// MUI v5 compatible icons module declaration
declare module '@mui/icons-material' {
  export * from '@mui/icons-material';
}

declare module '@mui/icons-material/*' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  const Icon: React.ComponentType<SvgIconProps>;
  export default Icon;
}