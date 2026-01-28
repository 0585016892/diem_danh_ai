import { Layout, Menu, Tooltip, Divider } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  CameraOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import LogoH from "../../styles/logo.png";

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const adminMenus = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Quản lý user",
    },
    {
      key: "/classes",
      icon: <BookOutlined />,
      label: "Quản lý lớp",
    },
    {
      key: "/students",
      icon: <TeamOutlined />,
      label: "Quản lý sinh viên",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Báo cáo & Thống kê",
    },
  ];

  const teacherMenus = [
    {
      key: "/attendance",
      icon: <CameraOutlined />,
      label: "Điểm danh",
    },
    {
      key: "/teacher",
      icon: <TeamOutlined />,
      label: "Lớp học của tôi",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={230}
      style={{
        background: "linear-gradient(180deg, #0f2027, #203a43, #2c5364)",
        boxShadow: "2px 0 20px rgba(0,0,0,.35)",
      }}
    >
      {/* LOGO */}
      <div style={styles.logo}>
        <img src={LogoH} width={42} alt="logo" />
        {!collapsed && (
          <div>
            <div style={styles.logoTitle}>HT - EduAttend</div>
            <div style={styles.logoSub}>Face Attendance</div>
          </div>
        )}
      </div>

      <Divider style={{ margin: "8px 0", borderColor: "rgba(255,255,255,.15)" }} />

      {/* ADMIN MENU */}
      {user.role === "admin" && (
        <>
          {!collapsed && <div style={styles.section}>ADMIN</div>}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={adminMenus.map(renderItem(collapsed))}
            onClick={({ key }) => navigate(key)}
            style={styles.menu}
          />
        </>
      )}

      {/* TEACHER MENU */}
      <>
        {!collapsed && <div style={styles.section}>GIÁO VIÊN</div>}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={teacherMenus.map(renderItem(collapsed))}
          onClick={({ key }) => navigate(key)}
          style={styles.menu}
        />
      </>

      {/* FOOTER */}
      {!collapsed && (
        <div style={styles.footer}>
          <div style={{ opacity: 0.6, fontSize: 12 }}>Đăng nhập với</div>
          <div style={{ fontWeight: 700, marginTop: 4 }}>
            {user.role === "admin" ? "ADMIN" : "GIÁO VIÊN"}
          </div>
        </div>
      )}
    </Sider>
  );
}

/* ================= HELPERS ================= */
const renderItem = (collapsed) => (item) => ({
  ...item,
  label: collapsed ? (
    <Tooltip title={item.label} placement="right">
      <span>{item.label}</span>
    </Tooltip>
  ) : (
    item.label
  ),
});

/* ================= STYLES ================= */
const styles = {
  logo: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,.12)",
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  logoSub: {
    fontSize: 11,
    opacity: 0.7,
  },
  section: {
    padding: "8px 16px",
    fontSize: 11,
    color: "rgba(255,255,255,.6)",
    letterSpacing: 1,
  },
  menu: {
    background: "transparent",
    borderRight: "none",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    opacity: 0.85,
  },
};
