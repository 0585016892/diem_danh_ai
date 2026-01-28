import {
  Layout,
  Button,
  Dropdown,
  Space,
  Avatar,
  Badge,
  Switch,
  message,
  Tooltip,
  Typography,
  List,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  WifiOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import systemApi from "../../api/systemApi";
import io from "socket.io-client";
import { useNotifications } from "../../contexts/NotificationContext";
import dayjs from "dayjs";

const socket = io("http://localhost:20031");
const { Header } = Layout;

export default function HeaderBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { darkMode, toggleTheme } = useTheme();
  const { Text } = Typography;

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
const getIcon = (type) => {
  switch (type) {
    case "late":
      return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    case "absent":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    case "present":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    default:
      return <NotificationOutlined style={{ color: "#1890ff" }} />;
  }
};
  /* ================= TIME + ONLINE ================= */
  const [time, setTime] = useState(new Date());
  const [online, setOnline] = useState(navigator.onLine);

  /* ================= CAMERA SYSTEM ================= */
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  /* ================= LOAD CAMERA STATUS ================= */
  useEffect(() => {
    const loadCameraStatus = async () => {
      try {
        const res = await systemApi.getCameraStatus();
        setCameraOn(res.data.camera_enabled);
      } catch {
        message.error("Không lấy được trạng thái hệ thống điểm danh");
      }
    };
    loadCameraStatus();
  }, []);

  /* ================= SOCKET SYNC ================= */
  useEffect(() => {
    socket.on("system:camera:on", () => setCameraOn(true));
    socket.on("system:camera:off", () => setCameraOn(false));

    return () => {
      socket.off("system:camera:on");
      socket.off("system:camera:off");
    };
  }, []);

  /* ================= TOGGLE CAMERA ================= */
  const toggleCamera = async (checked) => {
    setCameraLoading(true);
    try {
      await systemApi.toggleCamera(checked);
      setCameraOn(checked);
      message.success(
        checked ? "Đã bật hệ thống điểm danh" : "Đã tắt hệ thống điểm danh"
      );
    } catch {
      message.error("❌ Không thể thay đổi trạng thái");
    }
    setCameraLoading(false);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= USER MENU ================= */
  const menuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  /* ================= NOTIFICATION DROPDOWN ================= */
const notificationMenu = (
  <div
    style={{
      width: 360,
      maxHeight: 420,
      overflowY: "auto",
      padding: "4px 0",
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 8,
    }}
  >
    <List
      dataSource={notifications}
      locale={{ emptyText: "📭 Không có thông báo" }}
      renderItem={(item) => (
        <List.Item
          onClick={() => markAsRead(item.id)}
          style={{
            cursor: "pointer",
            padding: "12px 16px",
            background: item.is_read ? "#fff" : "#f0f7ff",
            borderLeft: item.is_read
              ? "3px solid transparent"
              : "3px solid #1890ff",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#e6f4ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = item.is_read
              ? "#fff"
              : "#f0f7ff")
          }
        >
          <List.Item.Meta
            avatar={
              <Badge dot={!item.is_read} offset={[-2, 2]}>
                {getIcon(item.type)}
              </Badge>
            }
            title={
              <Space direction="vertical" size={0}>
                <Text strong={!item.is_read}>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(item.created_at).format("HH:mm DD/MM")}
                </Text>
              </Space>
            }
            description={
              <Text type="secondary" ellipsis={{ rows: 2 }}>
                {item.content}
              </Text>
            }
          />
        </List.Item>
      )}
    />

    {notifications.length > 0 && (
      <div
        style={{
          textAlign: "center",
          padding: "10px 0",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <a onClick={markAllAsRead}>Đánh dấu tất cả đã đọc</a>
      </div>
    )}
  </div>
);



  return (
    <Header style={styles.header}>
      {/* LEFT */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />

      {/* RIGHT */}
      <Space size="large">
        {/* CLOCK */}
        <span>{time.toLocaleTimeString()}</span>

        {/* ONLINE */}
        <Space>
          <WifiOutlined style={{ color: online ? "#22c55e" : "#ef4444" }} />
          <small>{online ? "Online" : "Offline"}</small>
        </Space>

        {/* CAMERA SYSTEM */}
        {user.role === "admin" && (
          <Tooltip title="Bật / Tắt hệ thống điểm danh">
            <Space>
              <Switch
                checked={cameraOn}
                loading={cameraLoading}
                onChange={toggleCamera}
                checkedChildren={<VideoCameraOutlined />}
                unCheckedChildren={<VideoCameraAddOutlined />}
              />
              <small style={{ color: cameraOn ? "#22c55e" : "#ef4444" }}>
                {cameraOn ? "Điểm danh ON" : "Điểm danh OFF"}
              </small>
            </Space>
          </Tooltip>
        )}

        {/* DARK MODE */}
        <Switch
          checked={darkMode}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />

        {/* NOTIFICATION – FIX CHUẨN V5 */}
        <Dropdown
          trigger={["click"]}
          dropdownRender={() => notificationMenu}
        >
          <span
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Badge count={unreadCount} offset={[-2, 2]}>
              <BellOutlined style={{ fontSize: 20 }} />
            </Badge>
          </span>
        </Dropdown>

        {/* USER MENU */}
        <Dropdown menu={{ items: menuItems }}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 500 }}>{user.name}</div>
              <small>{user.role}</small>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}

const styles = {
  header: {
    background: "var(--card)",
    color: "var(--text)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};
