import { Layout } from "antd";
import { useState } from "react";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import { useTheme } from "../../contexts/ThemeContext";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useTheme();

  const contentStyle = {
    padding: 5,
    background: darkMode ? "#1f1f1f" : "#ffffff",
    color: darkMode ? "#f5f5f5" : "#111111",

    /* 🔥 KEY POINT */
    overflowY: "auto",
    height: "calc(100vh - 64px)", // Header cao 64px

    transition: "all 0.25s ease"
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* SIDEBAR - đứng im */}
      <Sidebar
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          background: "var(--card)",
          transition: "all 0.3s ease",
        }}
      />

      {/* MAIN */}
      <Layout>
        {/* HEADER - đứng im */}
        <HeaderBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* CONTENT - CUỘN */}
        <Content style={contentStyle}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
