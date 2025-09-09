// =====================================================
// Mobile Card Component
// Optimized card component for mobile interfaces
// =====================================================

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: React.ReactNode;
  avatarSrc?: string;
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
  badges?: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }>;
  metadata?: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }>;
  onClick?: () => void;
  onMenuClick?: () => void;
  showChevron?: boolean;
  compact?: boolean;
  elevation?: number;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  description,
  avatar,
  avatarSrc,
  status,
  badges = [],
  metadata = [],
  actions = [],
  onClick,
  onMenuClick,
  showChevron = false,
  compact = false,
  elevation = 1
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <Card
      elevation={elevation}
      onClick={onClick ? handleCardClick : undefined}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          elevation: 3,
          transform: 'translateY(-1px)',
        } : {},
        mb: compact ? 1 : 2,
      }}
    >
      <CardContent sx={{ pb: actions.length > 0 ? 1 : 2 }}>
        {/* Header Row */}
        <Box display="flex" alignItems="flex-start" gap={2}>
          {/* Avatar */}
          {(avatar || avatarSrc) && (
            <Avatar
              src={avatarSrc}
              sx={{
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
                flexShrink: 0,
              }}
            >
              {avatar}
            </Avatar>
          )}

          {/* Content */}
          <Box flex={1} minWidth={0}>
            {/* Title and Status Row */}
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography
                variant={compact ? 'subtitle2' : 'h6'}
                sx={{
                  fontWeight: 600,
                  fontSize: compact ? '0.875rem' : '1rem',
                  lineHeight: 1.2,
                  flex: 1,
                  minWidth: 0,
                }}
                noWrap
              >
                {title}
              </Typography>
              
              {status && (
                <Chip
                  label={status.label}
                  color={status.color}
                  size="small"
                  sx={{
                    height: compact ? 20 : 24,
                    fontSize: compact ? '0.7rem' : '0.75rem',
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>

            {/* Subtitle */}
            {subtitle && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: compact ? '0.75rem' : '0.875rem',
                  lineHeight: 1.3,
                  mb: description || badges.length > 0 || metadata.length > 0 ? 1 : 0,
                }}
                noWrap
              >
                {subtitle}
              </Typography>
            )}

            {/* Description */}
            {description && !compact && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  mb: badges.length > 0 || metadata.length > 0 ? 1 : 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </Typography>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <Box display="flex" gap={0.5} mb={metadata.length > 0 ? 1 : 0} flexWrap="wrap">
                {badges.map((badge, index) => (
                  <Chip
                    key={index}
                    label={badge.label}
                    color={badge.color || 'default'}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Metadata */}
            {metadata.length > 0 && !compact && (
              <Box>
                {metadata.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5}>
                    {item.icon && (
                      <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                        {item.icon}
                      </Box>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      {item.label}:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Action Icons */}
          <Box display="flex" alignItems="center" flexShrink={0}>
            {showChevron && (
              <ChevronRightIcon sx={{ color: 'text.secondary' }} />
            )}
            
            {onMenuClick && (
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ ml: showChevron ? 0 : 1 }}
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>

      {/* Actions */}
      {actions.length > 0 && (
        <>
          <Divider />
          <CardActions sx={{ px: 2, py: 1, gap: 1 }}>
            {actions.map((action, index) => (
              <IconButton
                key={index}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                color={action.color || 'default'}
                sx={{
                  minWidth: 'auto',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.1rem'
                  }
                }}
              >
                {action.icon}
              </IconButton>
            ))}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default MobileCard;
