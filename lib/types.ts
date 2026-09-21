export type Priority = 'HIGH' | 'MEDIUM' | 'NORMAL' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  deadline: string;
  completed: boolean;
}
