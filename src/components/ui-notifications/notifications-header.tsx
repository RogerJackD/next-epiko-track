import React from 'react'
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, Filter, CheckCheck, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface NotificationsHeaderProps {
  notificationCount?: number;
  onFilterChange?: (filters: NotificationFilters) => void;
  onMarkAllAsRead?: () => void;
  activeFilters?: NotificationFilters;
}

export interface NotificationFilters {
  priority?: string[];
  status?: string[];
  area?: string[];
}

export function NotificationsHeader({ 
  notificationCount = 0,
  onFilterChange,
  onMarkAllAsRead,
  activeFilters = {}
}: NotificationsHeaderProps) {
  const [localFilters, setLocalFilters] = React.useState<NotificationFilters>(activeFilters);

  const hasActiveFilters = 
    (localFilters.priority && localFilters.priority.length > 0) ||
    (localFilters.status && localFilters.status.length > 0) ||
    (localFilters.area && localFilters.area.length > 0);

  const togglePriority = (priority: string) => {
    const current = localFilters.priority || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    
    const newFilters = { ...localFilters, priority: updated };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Title and badge */}
          <div className="flex items-start md:items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 flex-shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Notificaciones
                </h1>
                {notificationCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 border">
                    {notificationCount} {notificationCount === 1 ? 'nueva' : 'nuevas'}
                  </Badge>
                )}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Tareas próximas a vencer en las próximas 24 horas
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Filtrar</span>
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-blue-500 text-white hover:bg-blue-600 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {(localFilters.priority?.length || 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtrar por prioridad</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={localFilters.priority?.includes('ALTA') || false}
                  onCheckedChange={() => togglePriority('ALTA')}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Alta
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={localFilters.priority?.includes('MEDIA') || false}
                  onCheckedChange={() => togglePriority('MEDIA')}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Media
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={localFilters.priority?.includes('BAJA') || false}
                  onCheckedChange={() => togglePriority('BAJA')}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Baja
                  </span>
                </DropdownMenuCheckboxItem>
                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearFilters} className="text-red-600">
                      <X className="w-4 h-4 mr-2" />
                      Limpiar filtros
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={onMarkAllAsRead}
              disabled={notificationCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Marcar leídas</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}