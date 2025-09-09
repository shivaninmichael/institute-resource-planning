export interface Activity {
  id: string;
  type: 'assignment' | 'payment' | 'exam' | 'attendance' | 'event';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status: 'pending' | 'completed' | 'upcoming';
  link?: string;
  icon?: string;
  color?: string;
}

export interface ActivityFormData {
  name: string;
  description: string;
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  location: string;
  maxParticipants: number;
  courseId: string;
  facultyId: string;
}

export interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  maxItems?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  onViewAll?: () => void;
}
