import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Tag,
  Tabs,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";

const { TabPane } = Tabs;

export default function Profile() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    userApi
      .getProfile()
      .then(res => {
        setUser(res.data);
        form.setFieldsValue(res.data);
      })
      .catch(() =>
        message.error("Không tải được thông tin người dùng")
      );
  }, [form]);

  /* ===== UPDATE INFO ===== */
  const updateProfile = async values => {
    setLoading(true);
    try {
      console.log("gọi api");
      
      await userApi.updateProfile(values);
      message.success("Cập nhật thông tin thành công");
    } catch {
      message.error("Cập nhật thất bại");
    }
    setLoading(false);
  };

  /* ===== CHANGE PASSWORD ===== */
  const changePassword = async values => {
    setLoading(true);
    try {
      await userApi.changePassword(values);
      message.success("Đổi mật khẩu thành công");
      passwordForm.resetFields();
    } catch (err) {
      message.error(
        err?.response?.data?.message ||
          "Đổi mật khẩu thất bại"
      );
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div style={{ width: "100%" }}>
      {/* ================= COVER ================= */}
      <div
        style={{
          height: 260,
          background:
            "linear-gradient(135deg,#1877f2,#4e8cff)",
          borderRadius: 16,
          position: "relative",
        }}
      >
        <Avatar
          size={150}
          icon={<UserOutlined />}
          style={{
            position: "absolute",
            bottom: -75,
            left: 40,
            border: "6px solid white",
            background: "#fff",
            color: "#1877f2",
          }}
        />
      </div>

      {/* ================= BASIC INFO ================= */}
      <div style={{ paddingLeft: 220, marginTop: 20 }}>
        <Space size="middle" align="center">
          <h1 style={{ margin: 0 }}>{user.name}</h1>
        </Space>
        <div style={{ color: "#555", marginTop: 6 }}>
          {user.email}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <Row gutter={24} style={{ marginTop: 40 }}>
        {/* LEFT – ABOUT */}
        <Col span={8}>
          <Card
            title="Giới thiệu"
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <p><b>Email:</b> {user.email}</p>
            <p><b>Vai trò:</b> {user.role === 'admin' ? 'Quản trị hệ thống' : 'Giáo viên'}</p>
            <p>
              <b>Trạng thái:</b>{" "}
              <Tag color={user.status === "active" ? "green" : "red"}>
                {user.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
              </Tag>
            </p>
            <p><b>Ngày tạo:</b> {user.created_at}</p>
          </Card>
        </Col>

        {/* RIGHT – TABS */}
        <Col span={16}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Tabs defaultActiveKey="info">
              {/* ===== TAB: UPDATE INFO ===== */}
              <TabPane tab="Sửa thông tin" key="info">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={updateProfile}
                  style={{ maxWidth: 500 }}
                >
                  <Form.Item
                    name="name"
                    label="Họ tên"
                    rules={[{ required: true, message: "Nhập họ tên" }]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item name="email" label="Email">
                    <Input
                      size="large"
                      disabled
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    Lưu thay đổi
                  </Button>
                </Form>
              </TabPane>

              {/* ===== TAB: CHANGE PASSWORD ===== */}
              <TabPane tab="Đổi mật khẩu" key="password">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={changePassword}
                  style={{ maxWidth: 400 }}
                >
                  <Form.Item
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    rules={[{ required: true }]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true },
                      { min: 6, message: "Ít nhất 6 ký tự" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    danger
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    Đổi mật khẩu
                  </Button>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
