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
} from "antd";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();

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
      render: (_, record) => (
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
              setEditing(record);
              setOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => remove(record.id)}>
            Xoá
          </Button>
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
      editing
        ? await userApi.update(editing.id, values)
        : await userApi.create(values);

      message.success("Thành công");
      setOpen(false);
      setEditing(null);
      form.resetFields();
      loadData(filters);
    } catch {
      message.error("Lỗi");
    }
    setLoading(false);
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

        <Button type="primary" onClick={() => setOpen(true)}>
          ➕ Thêm user
        </Button>
      </Space>

      {/* TABLE */}
      <Table rowKey="id" columns={columns} dataSource={users} bordered />

      {/* MODAL */}
      <Modal
        open={open}
        title={editing ? "✏️ Cập nhật user" : "➕ Thêm user"}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          {!editing && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="teacher">Teacher</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
