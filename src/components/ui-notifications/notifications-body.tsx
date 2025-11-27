'use client'
import { notificationService } from '@/services/notifications-service';
import React, { useEffect, useState } from 'react';
import { NotificationTaskResponse } from '@/types/notificationsResponse';
import { NotificationsTable } from './notifications-table';
import { NotificationsHeader, NotificationFilters } from './notifications-header';

type ViewType = 'upcoming' | 'overdue';

export default function NotificationsBody() {
  const [upcomingNotifications, setUpcomingNotifications] = useState<NotificationTaskResponse[]>([]);
  const [overdueNotifications, setOverdueNotifications] = useState<NotificationTaskResponse[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationTaskResponse[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('upcoming');

  // Fetch de ambos tipos de notificaciones
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setLoading(true);
        const [upcomingData, overdueData] = await Promise.all([
          notificationService.getNotificationsTasks(),
          notificationService.getOverDueTasks()
        ]);
        
        console.log('Próximas:', upcomingData);
        console.log('Vencidas:', overdueData);
        
        setUpcomingNotifications(upcomingData);
        setOverdueNotifications(overdueData);
        
        // Inicializar con la vista activa
        setFilteredNotifications(upcomingData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  // Aplicar filtros cuando cambian los filtros o la vista
  useEffect(() => {
    const currentNotifications = activeView === 'upcoming' 
      ? upcomingNotifications 
      : overdueNotifications;
    
    let filtered = [...currentNotifications];

    // Filtrar por prioridad
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(notification => 
        filters.priority!.includes(notification.priority)
      );
    }

    setFilteredNotifications(filtered);
  }, [filters, activeView, upcomingNotifications, overdueNotifications]);

  const handleFilterChange = (newFilters: NotificationFilters) => {
    setFilters(newFilters);
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    // Limpiar filtros al cambiar de vista
    setFilters({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NotificationsHeader 
        notificationCount={
          activeView === 'upcoming' 
            ? filteredNotifications.length 
            : filteredNotifications.length
        }
        onFilterChange={handleFilterChange}
        activeFilters={filters}
        activeView={activeView}
        onViewChange={handleViewChange}
        overdueCount={overdueNotifications.length}
      />
      <div className="px-4 md:px-6">
        <NotificationsTable notifications={filteredNotifications} />
      </div>
    </div>
  );
}