import { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import dashboardApi from "../api/dashboardApi";
import AdminDashboard from "../components/AdminDashboard";
import TeacherDashboard from "../components/TeacherDashboard";

const { Text } = Typography;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getAll();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Text type="danger">Không thể tải dashboard</Text>
      </div>
    );
  }

  return user.role === "admin" ? (
    <AdminDashboard data={data} />
  ) : (
    <TeacherDashboard data={data} />
  );
}
