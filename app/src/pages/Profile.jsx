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
  Divider,
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

  const updateProfile = async values => {
    setLoading(true);
    try {
      await userApi.updateProfile(values);
      message.success("Cập nhật thông tin thành công");
    } catch {
      message.error("Cập nhật thất bại");
    }
    setLoading(false);
  };

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
    <div style={{ padding: 24 }}>
      {/* ================= HEADER ================= */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          background:
            "linear-gradient(135deg, #1e3c72, #2a5298)",
          color: "#fff",
        }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{
                background: "#fff",
                color: "#2a5298",
                boxShadow: "0 0 0 6px rgba(255,255,255,0.25)",
              }}
            />
          </Col>

          <Col flex="auto">
            <h1 style={{ marginBottom: 4, color: "#fff" }}>
              {user.name}
            </h1>
            <div style={{ opacity: 0.85 }}>{user.email}</div>

            <Space style={{ marginTop: 12 }}>
              <Tag color="blue">
                {user.role === "admin"
                  ? "Quản trị hệ thống"
                  : "Giáo viên"}
              </Tag>
              <Tag
                color={
                  user.status === "active" ? "green" : "red"
                }
              >
                {user.status === "active"
                  ? "Đang hoạt động"
                  : "Ngưng hoạt động"}
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ================= CONTENT ================= */}
      <Row gutter={24} style={{ marginTop: 32 }}>
        {/* INFO CARD */}
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              height: "100%",
            }}
          >
            <h3>Thông tin tài khoản</h3>
            <Divider />

            <p>
              <b>Email:</b> <br /> {user.email}
            </p>

            <p>
              <b>Vai trò:</b> <br />
              {user.role === "admin"
                ? "Quản trị hệ thống"
                : "Giáo viên"}
            </p>

            <p>
              <b>Ngày tạo:</b> <br />
              {user.created_at}
            </p>
          </Card>
        </Col>

        {/* TABS */}
        <Col span={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 20 }}
          >
            <Tabs
              defaultActiveKey="info"
              size="large"
            >
              {/* UPDATE INFO */}
              <TabPane tab="Cập nhật thông tin" key="info">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={updateProfile}
                  style={{ maxWidth: 420 }}
                >
                  <Form.Item
                    name="name"
                    label="Họ tên"
                    rules={[
                      {
                        required: true,
                        message: "Nhập họ tên",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                  >
                    <Input
                      size="large"
                      disabled
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                  >
                    Lưu thay đổi
                  </Button>
                </Form>
              </TabPane>

              {/* CHANGE PASSWORD */}
              <TabPane tab="Đổi mật khẩu" key="password">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={changePassword}
                  style={{ maxWidth: 360 }}
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
                      {
                        min: 6,
                        message: "Ít nhất 6 ký tự",
                      },
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
