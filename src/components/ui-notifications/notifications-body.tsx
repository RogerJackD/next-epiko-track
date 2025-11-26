'use client'
import { notificationService } from '@/services/notifications-service';
import React, { useEffect, useState } from 'react';
import { NotificationTaskResponse } from '@/types/notificationsResponse';
import { NotificationsTable } from './notifications-table';
import { NotificationsHeader, NotificationFilters } from './notifications-header';

export default function NotificationsBody() {
  const [notifications, setNotifications] = useState<NotificationTaskResponse[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationTaskResponse[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationsTasks();
        console.log(data);
        setNotifications(data);
        setFilteredNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = [...notifications];

    // Filtrar por prioridad
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(notification => 
        filters.priority!.includes(notification.priority)
      );
    }

    setFilteredNotifications(filtered);
  }, [filters, notifications]);

  const handleFilterChange = (newFilters: NotificationFilters) => {
    setFilters(newFilters);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marcar todas como leídas');
    // Aquí puedes implementar la lógica para marcar como leídas
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Cargando notificaciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NotificationsHeader 
        notificationCount={filteredNotifications.length}
        onFilterChange={handleFilterChange}
        onMarkAllAsRead={handleMarkAllAsRead}
        activeFilters={filters}
      />
      <div className="px-4 md:px-6">
        <NotificationsTable notifications={filteredNotifications} />
      </div>
    </div>
  );
}