import React from 'react';
import { PlusCircle, Edit3, Trash2, CheckCircle2, UserMinus } from 'lucide-react';

interface TaskNotificationProps {
  type: 'created' | 'updated' | 'deleted' | 'completed' | 'removed';
  title: string;
  description?: string;
  metadata?: string;
}

export function TaskNotification({ type, title, description, metadata }: TaskNotificationProps) {
  const configs = {
    created: {
      icon: PlusCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      label: 'Nueva tarea asignada',
    },
    updated: {
      icon: Edit3,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      label: 'Tarea actualizada',
    },
    deleted: {
      icon: Trash2,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      label: 'Tarea eliminada',
    },
    completed: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      label: 'Tarea completada',
    },
    removed: {
      icon: UserMinus,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      label: 'Removido de tarea',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-1">
      <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">{config.label}</p>
        <p className="text-sm text-gray-600 mt-0.5 truncate">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {metadata && (
          <p className="text-xs text-gray-400 mt-1">{metadata}</p>
        )}
      </div>
    </div>
  );
}