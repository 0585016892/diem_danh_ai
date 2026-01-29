import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
  Checkbox,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import "./login.css";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await authApi.login(values);

      const storage = values.remember
        ? localStorage
        : sessionStorage;

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
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="left-content">
          <div className="logo">🏫</div>

          <Title level={2} style={{ color: "#fff" }}>
            HỆ THỐNG QUẢN LÝ ĐIỂM DANH
          </Title>

          <Text style={{ color: "#d1fae5", fontSize: 15 }}>
            Trường Tiểu học cơ sở Vũ An <br />
            Quản lý điểm danh bằng nhận diện khuôn mặt
          </Text>
        </div>

        <Text style={{ color: "#bbf7d0", marginTop: 24 }}>
          © {new Date().getFullYear()} Designer by HT
        </Text>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="form-wrapper">
          <Title className="d-flex align-content-center" level={3} style={{ color: "#047857" }}>
            Đăng nhập hệ thống
          </Title>

          <Text type="secondary">
            Dành cho giáo viên và cán bộ nhà trường
          </Text>

          <Spin spinning={loading}>
            <Form
              layout="vertical"
              style={{ marginTop: 32 }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                label="Email công vụ"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="gv.nguyenvana@school.edu.vn"
                  className="input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                  className="input"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="login-btn"
                loading={loading}
                block
              >
                ĐĂNG NHẬP
              </Button>

              <Text className="signup">
                Nếu quên mật khẩu, vui lòng liên hệ{" "}
                <b>Phòng CNTT</b>
              </Text>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
}
