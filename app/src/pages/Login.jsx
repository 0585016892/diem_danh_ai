import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Checkbox,
  message,
  Spin,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);

      const storage = values.remember ? localStorage : sessionStorage;

      storage.setItem("token", res.data.token);
      storage.setItem("user", JSON.stringify(res.data.user));

      message.success("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Không thể kết nối tới máy chủ";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={4}>Face Attendance System</Title>
          <Text type="secondary">
            Đăng nhập để tiếp tục
          </Text>
        </div>

        <Spin spinning={loading}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="teacher@school.edu.vn"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Nhập mật khẩu" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form>
        </Spin>

        <div className="login-footer">
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} Smart School System
          </Text>
        </div>
      </Card>
    </div>
  );
}
