import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Row,Col,Divider,
  Avatar  
} from "antd";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { UploadOutlined } from "@ant-design/icons";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);


  /* ================= LOAD DATA ================= */
  const loadData = async (params = {}) => {
    const res = await userApi.getAll(params);
    setUsers(res.data);
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  /* ================= STATUS ================= */
        const toggleStatus = async (user) => {
        await userApi.updateStatus(
            user.id,
            user.status === "active" ? "inactive" : "active"
        );
        message.success("Cập nhật trạng thái thành công");
        loadData();
        };


  /* ================= TABLE ================= */
  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
    title: "Trạng thái",
    render: (_, record) =>
      record.role === "admin" ? (
        <Tag color="gold">Admin</Tag>
      ) : (
        <Button
          type={record.status === "active" ? "default" : "primary"}
          danger={record.status === "active"}
          onClick={() => toggleStatus(record)}
        >
          {record.status === "active" ? "Khoá" : "Mở"}
        </Button>
      ),
  },

    {
      title: "Vai trò",
      dataIndex: "role",
      render: (r) => (
        <Tag color={r === "admin" ? "red" : "blue"}>
          {r.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setViewData(record);
              setViewOpen(true);
            }}
          >
            👁 Xem
          </Button>

          <Button
              onClick={() => {
                setEditing(record);
                setOpen(true);
                setAvatarFile(null); // ✅ rất quan trọng

                form.setFieldsValue(record);
                setAvatarPreview(
                  record.avatar
                    ? `http://localhost:20031/uploads/users/${record.avatar}`
                    : null
                );
              }}
            >
              Sửa
            </Button>

          {record.role !== "admin" && (
              <Button danger onClick={() => remove(record.id)}>
                Xoá
              </Button>
            )}

        </Space>
      ),
    },
  ];

  /* ================= DELETE ================= */
  const remove = async (id) => {
    Modal.confirm({
      title: "Xoá user?",
      onOk: async () => {
        await userApi.remove(id);
        message.success("Đã xoá");
        loadData(filters);
      },
    });
  };

  /* ================= SUBMIT ================= */
const onFinish = async (values) => {
  setLoading(true);
  try {
    const formData = new FormData();

    // append text fields
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      formData.append(key, value);
    });

    // append avatar nếu có
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    if (editing) {
      await userApi.update(editing.id, formData);
    } else {
      await userApi.create(formData);
    }

    message.success("Thành công");
    setOpen(false);
    setEditing(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.resetFields();
    loadData(filters);
  } catch (err) {
    console.error(err);
    message.error("Lỗi");
  }
  setLoading(false);
};
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN");
};

  return (
    <div style={{padding:16}}>
      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm tên / email"
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
        />
        <Select
          placeholder="Role"
          allowClear
          onChange={(v) => setFilters({ ...filters, role: v })}
        >
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="teacher">Teacher</Select.Option>
        </Select>
        <Select
          placeholder="Status"
          allowClear
          onChange={(v) => setFilters({ ...filters, status: v })}
        >
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>

        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setEditing(null);
            setAvatarFile(null);
            setAvatarPreview(null);
            form.resetFields(); // ✅ QUAN TRỌNG
          }}
        >
          ➕ Thêm user
        </Button>

      </Space>

      {/* TABLE */}
      <Table rowKey="id" columns={columns} dataSource={users} bordered />
      <Modal
        open={viewOpen}
        title={
            viewData?.role === "admin"
              ? "👑 Chi tiết quản trị viên"
              : "👨‍🏫 Chi tiết giáo viên"
          }
        footer={null}
        onCancel={() => {
          setViewOpen(false);
          setViewData(null);
        }}
        width={900}
      >
        {viewData && (
          <Row gutter={24}>
            {/* CỘT TRÁI – AVATAR */}
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={`http://localhost:20031/uploads/users/${viewData.avatar}`}
                style={{ marginBottom: 12 }}
              >
                {viewData.name?.charAt(0)}
              </Avatar>

              <h3 style={{ marginBottom: 4 }}>{viewData.name}</h3>

              <Tag color={viewData.role === "admin" ? "red" : "blue"}>
                {viewData.role  === "admin" ? "Quản trị viên" : "Giáo viên"}
              </Tag>

              <div style={{ marginTop: 8 }}>
                <Tag color={viewData.status === "active" ? "green" : "red"}>
                  {viewData.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
                </Tag>
              </div>
            </Col>

            {/* CỘT PHẢI – THÔNG TIN */}
            <Col span={18}>
              <Tag color="blue">Thông tin cá nhân</Tag>

              <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
                <Col span={12}>
                  <p><b>Email:</b> {viewData.email}</p>
                </Col>

                <Col span={12}>
                  <p><b>Giới tính:</b> {viewData.gender === 'male' ? 'Nam' : 'Nữ' || "—"}</p>
                </Col>

                <Col span={12}>
                  <p><b>Ngày sinh:</b> {formatDate(viewData.date_of_birth)}</p>
                </Col>

                <Col span={24}>
                  <p><b>Địa chỉ:</b> {viewData.address || "—"}</p>
                </Col>
              </Row>

              <Divider />

              <Tag color="green">Thông tin công việc</Tag>

              <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
                <Col span={12}>
                  <p><b>Chức vụ:</b> {viewData.position || "—"}</p>
                </Col>

               {viewData?.role !== "admin" && (
                    <Col span={12}>
                      <p>
                        <b>Lớp chủ nhiệm:</b>{" "}
                        {viewData.class_name || viewData.class_id || "—"}
                      </p>
                    </Col>
                  )}

              </Row>

              <Divider />

              <Tag color="orange">Ghi chú</Tag>
              <div
                style={{
                  background: "#fafafa",
                  padding: 12,
                  borderRadius: 6,
                  minHeight: 80,
                  marginTop: 8,
                }}
              >
                {viewData.note || "Không có ghi chú"}
              </div>
            </Col>
          </Row>
        )}
      </Modal>

      {/* MODAL */}
<Modal
  open={open}
  title={editing ? "✏️ Cập nhật user" : "➕ Thêm user"}
onCancel={() => {
  setOpen(false);
  setEditing(null);
  setAvatarPreview(null);
  setAvatarFile(null);
  form.resetFields(); // ✅ tránh sót
}}
  onOk={() => form.submit()}
  confirmLoading={loading}
  width={850}
  centered
>
  <Form form={form} layout="vertical" onFinish={onFinish}>
    {/* ===== AVATAR CENTER ===== */}
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <Upload
        showUploadList={false}
        beforeUpload={(file) => {
          setAvatarFile(file);
          setAvatarPreview(URL.createObjectURL(file));
          return false;
        }}
      >
        <Avatar
          size={120}
          src={
            avatarPreview ||
            (editing?.avatar &&
              `http://localhost:20031/uploads/users/${editing.avatar}`)
          }
          style={{
            border: "2px solid #e5e7eb",
            cursor: "pointer",
          }}
        >
          {form.getFieldValue("name")?.charAt(0)}
        </Avatar>
      </Upload>
      <div style={{ marginTop: 8, color: "#888" }}>
        Click để đổi avatar
      </div>
    </div>

    <Row gutter={24}>
      {/* ===== CỘT TRÁI ===== */}
      <Col span={12}>
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input disabled={!!editing} />
        </Form.Item>

        {!editing && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        )}

        <Form.Item name="gender" label="Giới tính">
          <Select allowClear placeholder="Chọn giới tính">
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* ===== CỘT PHẢI ===== */}
      <Col span={12}>
        <Form.Item name="date_of_birth" label="Ngày sinh">
          <Input
            type="date"
            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
          />
        </Form.Item>


        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Quận / Thành phố" />
        </Form.Item>

        <Form.Item name="position" label="Chức vụ">
          <Input placeholder="Giáo viên chủ nhiệm" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="teacher">Teacher</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    {/* ===== NOTE ===== */}
    <Form.Item name="note" label="Ghi chú">
      <Input.TextArea
        rows={3}
        placeholder="Thông tin bổ sung..."
        style={{ resize: "none" }}
      />
    </Form.Item>
  </Form>
</Modal>



    </div>
  );
}
