import { Row, Col, Typography, Card } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import StatCard from "../components/StatCard";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Title, Text } = Typography;

export default function AdminDashboard({ data }) {
  const { darkMode } = useTheme();

  if (!data) return null;

  const cardStyle = {
    borderRadius: 16,
    background: darkMode ? "#1f1f1f" : "#fff",
    color: darkMode ? "#f5f5f5" : "#111",
    transition: "all 0.25s ease",
  };

  const gridColor = darkMode ? "#333" : "#eee";
  const textColor = darkMode ? "#ccc" : "#555";

  return (
    <div style={{ padding: 16 }}>
      <Title level={3} style={{ color: darkMode ? "#fff" : "#111" }}>
        📊 Dashboard Quản trị hệ thống
      </Title>
      <Text style={{ color: textColor }}>
        Toàn bộ dữ liệu điểm danh trong hệ thống
      </Text>

      {/* ===== STAT CARDS ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={6}>
          <StatCard
            title="Giáo viên"
            value={data.teachers}
            icon={<UserOutlined />}
            color="#1677ff"
          />
        </Col>

        <Col xs={24} md={6}>
          <StatCard
            title="Học sinh"
            value={data.students}
            icon={<TeamOutlined />}
            color="#52c41a"
          />
        </Col>

        <Col xs={24} md={6}>
          <StatCard
            title="Lớp học"
            value={data.classes}
            icon={<ApartmentOutlined />}
            color="#faad14"
          />
        </Col>

        <Col xs={24} md={6}>
          <StatCard
            title="Điểm danh hôm nay"
            value={data.attendanceToday}
            icon={<CheckCircleOutlined />}
            color="#eb2f96"
          />
        </Col>
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        {/* ===== CHART SĨ SỐ ===== */}
        <Col xs={24} md={12}>
          <Card style={{ color: textColor }} title="👨‍🎓 Sĩ số theo lớp" bordered={false} >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chartStudents}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="className"
                  tick={{ fill: textColor }}
                />
                <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? "#141414" : "#fff",
                    border: "none",
                    color: textColor,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="total"
                  name="Tổng học sinh"
                  fill="#52c41a"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* ===== CHART ĐIỂM DANH ===== */}
        <Col xs={24} md={12}>
          <Card
            title="✅ Điểm danh hôm nay theo lớp"
            bordered={false}
            style={{ color: textColor }} 
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chartAttendance}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="className"
                  tick={{ fill: textColor }}
                />
                <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? "#141414" : "#fff",
                    border: "none",
                    color: textColor,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="total"
                  name="Đã điểm danh"
                  fill="#1677ff"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
