// =====================================================
// OpenEducat ERP Frontend - Advanced Search & Filter Component
// Reusable search and filter functionality
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Collapse,
  IconButton,
  Autocomplete,
  Slider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'range' | 'autocomplete';
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  filterFields?: FilterField[];
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onReset?: () => void;
  showAdvanced?: boolean;
  defaultFilters?: Record<string, any>;
  suggestions?: string[];
  loading?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = 'Search...',
  filterFields = [],
  onSearch,
  onFilter,
  onReset,
  showAdvanced = true,
  defaultFilters = {},
  suggestions = [],
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Update active filters list
    const active = Object.keys(filters).filter(key => {
      const value = filters[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return !isNaN(value);
      if (value instanceof Date) return true;
      return value !== null && value !== undefined;
    });
    setActiveFilters(active);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleClearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleResetAll = () => {
    setSearchTerm('');
    setFilters({});
    setActiveFilters([]);
    onReset?.();
  };

  const renderFilterField = (field: FilterField) => {
    const value = filters[field.key];

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              label={field.label}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => {
                    const option = field.options?.find(opt => opt.value === val);
                    return (
                      <Chip
                        key={val}
                        label={option?.label || val}
                        size="small"
                        onDelete={() => {
                          const newValue = (value || []).filter((v: any) => v !== val);
                          handleFilterChange(field.key, newValue);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            fullWidth
            options={field.options || []}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
            value={value || null}
            onChange={(_, newValue) => handleFilterChange(field.key, newValue)}
            renderInput={(params) => (
              <TextField {...params} label={field.label} placeholder={field.placeholder} />
            )}
          />
        );

      case 'date':
        return (
          <TextField
            label={field.label}
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'daterange':
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label={`${field.label} From`}
                type="date"
                value={value?.from || ''}
                onChange={(e) => handleFilterChange(field.key, { ...value, from: e.target.value })}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`${field.label} To`}
                type="date"
                value={value?.to || ''}
                onChange={(e) => handleFilterChange(field.key, { ...value, to: e.target.value })}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value ? Number(e.target.value) : '')}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step,
            }}
          />
        );

      case 'range':
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {field.label}
            </Typography>
            <Slider
              value={value || [field.min || 0, field.max || 100]}
              onChange={(_, newValue) => handleFilterChange(field.key, newValue)}
              valueLabelDisplay="auto"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          {/* Search Bar */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={showAdvanced ? 8 : 10}>
              <TextField
                fullWidth
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: searchTerm && (
                    <IconButton
                      size="small"
                      onClick={() => handleSearchChange('')}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            
            {showAdvanced && filterFields.length > 0 && (
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
                </Button>
              </Grid>
            )}
            
            {(activeFilters.length > 0 || searchTerm) && (
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={handleResetAll}
                >
                  Clear All
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((key) => {
                const field = filterFields.find(f => f.key === key);
                const value = filters[key];
                let displayValue = value;
                
                if (Array.isArray(value)) {
                  displayValue = value.length > 1 ? `${value.length} selected` : value[0];
                } else if (value instanceof Date) {
                  displayValue = value.toLocaleDateString();
                } else if (typeof value === 'object' && value.from && value.to) {
                  displayValue = `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`;
                }

                return (
                  <Chip
                    key={key}
                    label={`${field?.label}: ${displayValue}`}
                    onDelete={() => handleClearFilter(key)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                );
              })}
            </Box>
          )}

          {/* Advanced Filters */}
          <Collapse in={showFilters}>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Advanced Filters
              </Typography>
              <Grid container spacing={3}>
                {filterFields.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field.key}>
                    {renderFilterField(field)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default SearchFilter;
