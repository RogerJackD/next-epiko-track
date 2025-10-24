'use client'
import { notificationService } from '@/services/notifications-service';
import React, { useEffect, useState } from 'react';
import { NotificationTaskResponse } from '@/types/notificationsResponse';
import { NotificationsTable } from './notifications-table';

export default function NotificationsBody() {

    const [notifications, setNotifications] = useState<NotificationTaskResponse[]>([])

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const data = await notificationService.getNotificationsTasks();
                console.log(data);
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);
    

  if (loading) {
        return <div className="flex justify-center p-8">Cargando...</div>;
    }

    return <NotificationsTable notifications={notifications} />;
}
