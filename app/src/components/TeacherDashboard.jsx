import { Row, Col, Typography, Alert, Card, Progress } from "antd";
import {
  TeamOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import StatCard from "./StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

export default function TeacherDashboard({ data }) {
  if (!data) return null;

  const attendancePercent = data.students
    ? Math.round((data.attendanceToday / data.students) * 100)
    : 0;

  const chartData = [
    {
      name: data.className || "Lớp của bạn",
      total: data.students,
      attended: data.attendanceToday,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Title level={3}>👩‍🏫 Dashboard Giáo viên</Title>
      <Text type="secondary">
        Thống kê lớp bạn đang chủ nhiệm
      </Text>

      <Alert
        type="info"
        showIcon
        style={{ marginTop: 16 }}
        message="Bạn chỉ xem được dữ liệu của lớp mình phụ trách"
      />

      {/* ===== STAT CARDS ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <StatCard
            title="Lớp phụ trách"
            value={data.className || data.classes}
            icon={<ApartmentOutlined />}
            color="#1677ff"
          />
        </Col>

        <Col xs={24} md={8}>
          <StatCard
            title="Học sinh"
            value={data.students}
            icon={<TeamOutlined />}
            color="#52c41a"
          />
        </Col>

        <Col xs={24} md={8}>
          <StatCard
            title="Đã điểm danh hôm nay"
            value={data.attendanceToday}
            icon={<CheckCircleOutlined />}
            color="#eb2f96"
          />
        </Col>
      </Row>

      {/* ===== ATTENDANCE RATE ===== */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Title level={4}>🎯 Tỷ lệ chuyên cần hôm nay</Title>

            <Progress
              type="circle"
              percent={attendancePercent}
              width={160}
              strokeColor={
                attendancePercent >= 90
                  ? "#52c41a"
                  : attendancePercent >= 70
                  ? "#faad14"
                  : "#ff4d4f"
              }
            />

            <Text style={{ display: "block", marginTop: 16 }}>
              {data.attendanceToday} / {data.students} học sinh đã điểm danh
            </Text>
          </Card>
        </Col>
      </Row>

      {/* ===== CHART ===== */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card
            title="📊 So sánh sĩ số & điểm danh"
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="total"
                  name="Tổng học sinh"
                  fill="#52c41a"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="attended"
                  name="Đã điểm danh"
                  fill="#1677ff"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
