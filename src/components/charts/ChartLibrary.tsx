// =====================================================
// Chart Library Component
// Comprehensive chart components for analytics and reporting
// =====================================================

import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  ScatterChart as RechartsScatterChart,
  RadarChart as RechartsRadarChart,
  RadarChart as RechartsPolarAreaChart,
  Bar,
  Line,
  Pie,
  Area,
  Scatter,
  Radar,
  Radar as PolarArea,
  XAxis,
  YAxis,
  CartesianGrid,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface ChartProps {
  data: any;
  options?: any;
  title?: string;
  height?: number;
  width?: number;
}

// Default chart colors
const defaultColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'
];

// Chart wrapper component
const ChartWrapper: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card>
    <CardContent>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <Box height={300}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

// Bar Chart Component
export const BarChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Line Chart Component
export const LineChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Pie Chart Component
export const PieChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 137.5}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Doughnut Chart Component
export const DoughnutChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 137.5}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Area Chart Component
export const AreaChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Scatter Chart Component
export const ScatterChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis dataKey="y" />
        <Tooltip />
        <Legend />
        <Scatter dataKey="value" fill="#8884d8" />
      </RechartsScatterChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Bubble Chart Component
export const BubbleChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis dataKey="y" />
        <Tooltip />
        <Legend />
        <Scatter dataKey="value" fill="#8884d8" />
      </RechartsScatterChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Radar Chart Component
export const RadarChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar name="value" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Polar Area Chart Component
export const PolarAreaChart: React.FC<ChartProps> = ({ data, options, title, height = 300 }) => (
  <ChartWrapper title={title}>
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPolarAreaChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <PolarArea dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Legend />
      </RechartsPolarAreaChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Combined Chart Component (supports multiple chart types)
export const CombinedChart: React.FC<ChartProps & { chartType: string }> = ({
  data,
  options,
  title,
  chartType,
  height = 300,
}) => {
  const renderChart = () => {
    switch (chartType.toLowerCase()) {
      case 'bar':
        return <BarChart data={data} options={options} height={height} />;
      case 'line':
        return <LineChart data={data} options={options} height={height} />;
      case 'pie':
        return <PieChart data={data} options={options} height={height} />;
      case 'doughnut':
        return <DoughnutChart data={data} options={options} height={height} />;
      case 'area':
        return <AreaChart data={data} options={options} height={height} />;
      case 'scatter':
        return <ScatterChart data={data} options={options} height={height} />;
      case 'bubble':
        return <BubbleChart data={data} options={options} height={height} />;
      case 'radar':
        return <RadarChart data={data} options={options} height={height} />;
      case 'polar':
        return <PolarAreaChart data={data} options={options} height={height} />;
      default:
        return <BarChart data={data} options={options} height={height} />;
    }
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      {renderChart()}
    </Box>
  );
};

// Chart data generators for common use cases
export const chartDataGenerators = {
  // Generate bar chart data
  barChart: (labels: string[], datasets: { label: string; data: number[]; color?: string }[]) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 0.6)`,
      borderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
      borderWidth: 1,
    })),
  }),

  // Generate line chart data
  lineChart: (labels: string[], datasets: { label: string; data: number[]; color?: string }[]) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      fill: false,
      borderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
      backgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 0.2)`,
      tension: 0.1,
    })),
  }),

  // Generate pie chart data
  pieChart: (labels: string[], data: number[], colors?: string[]) => ({
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || labels.map((_, index) => `hsla(${index * 137.5}, 70%, 50%, 0.6)`),
        borderColor: colors || labels.map((_, index) => `hsla(${index * 137.5}, 70%, 50%, 1)`),
        borderWidth: 1,
      },
    ],
  }),

  // Generate area chart data
  areaChart: (labels: string[], datasets: { label: string; data: number[]; color?: string }[]) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      fill: true,
      borderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
      backgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 0.2)`,
      tension: 0.4,
    })),
  }),

  // Generate scatter chart data
  scatterChart: (datasets: { label: string; data: { x: number; y: number }[]; color?: string }[]) => ({
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 0.6)`,
      borderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
    })),
  }),

  // Generate radar chart data
  radarChart: (labels: string[], datasets: { label: string; data: number[]; color?: string }[]) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      fill: true,
      backgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 0.2)`,
      borderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
      pointBackgroundColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: dataset.color || `hsla(${index * 137.5}, 70%, 50%, 1)`,
    })),
  }),
};

// Chart color palettes
export const chartColorPalettes = {
  default: [
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ],
  pastel: [
    'rgba(255, 182, 193, 0.6)',
    'rgba(173, 216, 230, 0.6)',
    'rgba(144, 238, 144, 0.6)',
    'rgba(255, 218, 185, 0.6)',
    'rgba(221, 160, 221, 0.6)',
    'rgba(255, 255, 224, 0.6)',
  ],
  vibrant: [
    'rgba(255, 0, 0, 0.6)',
    'rgba(0, 255, 0, 0.6)',
    'rgba(0, 0, 255, 0.6)',
    'rgba(255, 255, 0, 0.6)',
    'rgba(255, 0, 255, 0.6)',
    'rgba(0, 255, 255, 0.6)',
  ],
  professional: [
    'rgba(70, 130, 180, 0.6)',
    'rgba(106, 90, 205, 0.6)',
    'rgba(220, 20, 60, 0.6)',
    'rgba(255, 140, 0, 0.6)',
    'rgba(50, 205, 50, 0.6)',
    'rgba(186, 85, 211, 0.6)',
  ],
};

export default {
  BarChart,
  LineChart,
  PieChart,
  DoughnutChart,
  AreaChart,
  ScatterChart,
  BubbleChart,
  RadarChart,
  PolarAreaChart,
  CombinedChart,
  chartDataGenerators,
  chartColorPalettes,
};
