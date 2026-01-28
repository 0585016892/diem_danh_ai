import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Avatar,
  Row,
  Col,
  Spin,
  Empty,
  Alert,
  DatePicker,
  Space,
  Button,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
    BankOutlined,
  UsergroupAddOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import teacherApi from "../api/teacherApi";
import { useUser } from "../contexts/UserContext";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;

export default function TeacherClassStudents() {
  const { user } = useUser();

  const role = user?.role;
  const classId = user?.class_id;

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(dayjs()); // mặc định hôm nay

  /* ================= FETCH DATA ================= */
const fetchStudents = () => {
  if (!user || role !== "teacher" || !classId) {
    setStudents([]);
    setLoading(false);
    return;
  }

  setLoading(true);

  const selectedDate = date
    ? dayjs(date).format("YYYY-MM-DD")
    : null;

  teacherApi
    .getStudentsByClass(classId, selectedDate)
    .then((res) => {
    console.log(res);

      setClassInfo(res.data.class);
      setStudents(res.data.students || []);
    })
    
    .catch((err) => {
      console.error("❌ fetchStudents:", err);
      setStudents([]);
    })
    .finally(() => setLoading(false));
};

  /* ================= LOAD LẦN ĐẦU ================= */
useEffect(() => {
  if (!user) return;

  if (role === "teacher" && classId) {
    fetchStudents();
  } else {
    setLoading(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, role, classId, date]);

  /* ================= EXPORT EXCEL ================= */
  const exportExcel = () => {
    const dataExport = students.map((s, index) => ({
      STT: index + 1,
      "Họ tên": s.name,
      "Mã HS": s.student_code,
      "Giới tính": s.gender === "male" ? "Nam" : "Nữ",
      "Trạng thái": s.status === "active" ? "Đang học" : "Ngưng học",
      "Điểm danh":
        s.attendanceStatus === "absent"
          ? "Vắng"
          : s.attendanceStatus === "late"
          ? "Đi muộn"
          : "Đúng giờ",

      "Giờ điểm danh": s.attendanceTime
        ? dayjs(s.attendanceTime).format("HH:mm DD/MM/YYYY")
        : "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách học sinh");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const fileDate = date ? dayjs(date).format("DD-MM-YYYY") : "tat-ca-ngay";
    saveAs(fileData, `Si-so_chuyen-can_${fileDate}.xlsx`);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  /* ================= ADMIN VIEW ================= */
  if (role === "admin") {
    return (
      <Card style={{ borderRadius: 16, marginTop: 40, textAlign: "center" }}>
        <CrownOutlined style={{ fontSize: 48, color: "#faad14" }} />
        <Title level={3} style={{ marginTop: 16 }}>
          Trang quản trị Admin
        </Title>
        <Text type="secondary">
          Admin không có lớp chủ nhiệm.
          <br />
          Vui lòng vào <b>Quản lý lớp</b> hoặc <b>Quản lý học sinh</b>.
        </Text>
      </Card>
    );
  }

  /* ================= TEACHER NO CLASS ================= */
  if (!classId) {
    return (
      <Alert
        type="warning"
        showIcon
        style={{ marginTop: 40 }}
        message="Chưa được phân công lớp"
        description="Hiện tại bạn chưa được gán làm giáo viên chủ nhiệm cho lớp nào."
      />
    );
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Học sinh",
      dataIndex: "name",
      render: (name) => (
        <Row align="middle" gutter={12}>
          <Col>
            <Avatar icon={<UserOutlined />} />
          </Col>
          <Col>
            <Text strong>{name}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "Mã HS",
      dataIndex: "student_code",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (g) => (
        <Tag color={g === "male" ? "blue" : "pink"}>
          {g === "male" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
   {
  title: "Điểm danh",
  render: (_, record) => {
    if (record.attendanceStatus === "absent") {
      return <Tag color="red">Vắng</Tag>;
    }

    if (record.attendanceStatus === "late") {
      return (
        <>
          <Tag color="orange">Đi muộn</Tag>
          <div style={{ fontSize: 12, color: "#888" }}>
            <ClockCircleOutlined />{" "}
            {dayjs(record.attendanceTime).format("HH:mm DD/MM")}
          </div>
        </>
      );
    }

    return (
      <>
        <Tag color="green">Đúng giờ</Tag>
        <div style={{ fontSize: 12, color: "#888" }}>
          <ClockCircleOutlined />{" "}
          {dayjs(record.attendanceTime).format("HH:mm DD/MM")}
        </div>
      </>
    );
  },
},
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag
          icon={<CheckCircleOutlined />}
          color={s === "active" ? "green" : "red"}
        >
          {s === "active" ? "Đang học" : "Ngưng học"}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{padding:16}}>
      <Title level={3}>📚 Lớp chủ nhiệm của tôi</Title>
      <Text type="secondary">
        Danh sách học sinh & tình hình điểm danh
      </Text>

      <Space style={{ marginTop: 16 }}>
        <DatePicker
            value={date}
            format="DD/MM/YYYY"
            allowClear
            disabledDate={(current) => {
              // ❌ chặn ngày tương lai
              return current && current > dayjs().endOf("day");
            }}
            onChange={(d) => setDate(d)}
          />

        <Button icon={<DownloadOutlined />} onClick={exportExcel}>
          Xuất Excel
        </Button>
      </Space>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Space>
              <BankOutlined style={{ fontSize: 28, color: "#1677ff" }} />
              <div>
                <Text type="secondary">Lớp học</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {classInfo?.name}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Space>
              <UsergroupAddOutlined style={{ fontSize: 28, color: "#13c2c2" }} />
              <div>
                <Text type="secondary">Sĩ số</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {students.length}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Space>
              <CheckSquareOutlined style={{ fontSize: 28, color: "#52c41a" }} />
              <div>
                <Text type="secondary">Có mặt</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {students.filter((s) => s.attendanceStatus !== "absent").length}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>


      <Card style={{ marginTop: 24, borderRadius: 16 }}>
        <Title level={4}>
          <TeamOutlined /> Danh sách học sinh
        </Title>

        {students.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={students}
            pagination={{ pageSize: 8 }}
          />
        )}
      </Card>
    </div>
  );
}
