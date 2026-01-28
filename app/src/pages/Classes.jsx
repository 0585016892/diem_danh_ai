import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
   Row, Col 
} from "antd";
import { useEffect, useState } from "react";
import classApi from "../api/classApi";
import userApi from "../api/userApi";

export default function Classes() {
  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /* ================= LOAD DATA ================= */
  const loadData = async (params = {}) => {
    const res = await classApi.getAll(params);
    setData(res.data);
  };

  const loadTeachers = async () => {
    const res = await userApi.getTeachers();
    setTeachers(res.data);
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  useEffect(() => {
    loadTeachers();
  }, []);

  /* ================= STATUS ================= */
  const toggleStatus = async (record) => {
    await classApi.updateStatus(
      record.id,
      record.status === "active" ? "inactive" : "active"
    );
    message.success("Đã cập nhật trạng thái");
    loadData(filters);
  };

  /* ================= TABLE ================= */
  const columns = [
    { title: "Tên lớp", dataIndex: "name" },
    { title: "Khối", dataIndex: "grade" },
    { title: "Năm học", dataIndex: "school_year" },
    { title: "Phòng", dataIndex: "room" },
    {
      title: "GVCN",
      dataIndex: "teacher_name",
      render: (v) => v || "—",
    },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Button
          danger={r.status === "active"}
          onClick={() => toggleStatus(r)}
        >
          {r.status === "active" ? "Khoá" : "Mở"}
        </Button>
      ),
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(r);
              setOpen(true);
              form.setFieldsValue(r);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => remove(r.id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  /* ================= DELETE ================= */
  const remove = async (id) => {
    Modal.confirm({
      title: "Xoá lớp?",
      content: "Bạn chắc chắn muốn xoá lớp này?",
      onOk: async () => {
        await classApi.remove(id);
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
        ? await classApi.update(editing.id, values)
        : await classApi.create(values);

      message.success("Thành công");
      setOpen(false);
      setEditing(null);
      form.resetFields();
      loadData(filters);
    } catch (err) {
      message.error("Lỗi xử lý");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm tên lớp"
          allowClear
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 140 }}
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
            form.resetFields();
          }}
        >
          ➕ Thêm lớp
        </Button>
      </Space>

      {/* TABLE */}
      <Table rowKey="id" columns={columns} dataSource={data} bordered />

      {/* MODAL */}

<Modal
  open={open}
  width={800} // 👈 MODAL NGANG
  title={editing ? "✏️ Cập nhật lớp" : "➕ Thêm lớp"}
  onCancel={() => {
    setOpen(false);
    setEditing(null);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  confirmLoading={loading}
>
  <Form form={form} layout="vertical" onFinish={onFinish}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="name"
          label="Tên lớp"
          rules={[{ required: true }]}
        >
          <Input placeholder="VD: 10A1" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="grade" label="Khối">
          <Input placeholder="VD: 10" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="school_year" label="Năm học">
          <Input placeholder="VD: 2024 - 2025" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="room" label="Phòng">
          <Input placeholder="VD: A203" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="homeroom_teacher_id"
          label="Giáo viên chủ nhiệm"
        >
          <Select allowClear placeholder="Chọn giáo viên">
            {teachers.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="max_students" label="Sĩ số tối đa">
          <Input type="number" />
        </Form.Item>
      </Col>

      {/* FULL WIDTH */}
      <Col span={24}>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Modal>

    </div>
  );
}
