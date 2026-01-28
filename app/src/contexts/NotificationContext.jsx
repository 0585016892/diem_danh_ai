import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import notificationApi from "../api/notificationApi";

const NotificationContext = createContext();
const socket = io("http://localhost:20031");

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ===== LOAD BAN ĐẦU ===== */
  useEffect(() => {
    const load = async () => {
      const res = await notificationApi.getMyNotifications();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    };
    load();
  }, []);

  /* ===== SOCKET REALTIME ===== */
  useEffect(() => {
    socket.on("notification:new", noti => {
      setNotifications(prev => [noti, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.off("notification:new");
  }, []);

  /* ===== ACTIONS ===== */
  const markAsRead = async id => {
    await notificationApi.markRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
