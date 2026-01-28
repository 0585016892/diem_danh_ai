import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Row,
  Col,
  DatePicker,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import studentApi from "../api/studentApi";
import classApi from "../api/classApi";
import dayjs from "dayjs";
import { getDescriptorFromImage } from "../utils/face";

export default function Students() {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();

  /* ===== FACE STATE ===== */
  const [preview, setPreview] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [detecting, setDetecting] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadData = async (params = {}) => {
    const res = await studentApi.getAll(params);
    setData(res.data);
  };

  const loadClasses = async () => {
    const res = await classApi.getAll({ status: "active" });
    setClasses(res.data);
  };

  useEffect(() => {
    loadData(filters);
    loadClasses();
  }, [filters]);

  /* ================= TABLE ================= */
  const columns = [
    { title: "Họ tên", dataIndex: "name" },
    {
      title: "Ảnh",
      dataIndex: "face_image",
      render: (v) =>
        v ? (
          <img
            src={`http://localhost:20031/uploads/students/${v}`}
            style={{ width: 50, height: 50, borderRadius: 6 }}
          />
        ) : (
          <Tag color="orange">Chưa có</Tag>
        ),
    },
    { title: "Mã HS", dataIndex: "student_code" },
    { title: "Lớp", dataIndex: "class_name" },
    { title: "Giới tính", dataIndex: "gender" },
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
    },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "Địa chỉ", dataIndex: "address" },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Tag color={r.status === "active" ? "green" : "red"}>
          {r.status}
        </Tag>
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
              setPreview(
                r.face_image
                  ? `http://localhost:20031/uploads/students/${r.face_image}`
                  : null
              );
              setFaceDescriptor(null);
              setRawFile(null);
              form.setFieldsValue({
                ...r,
                date_of_birth: r.date_of_birth
                  ? dayjs(r.date_of_birth)
                  : null,
              });
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  /* ================= FACE DETECT ================= */
  const handleDetectFace = async () => {
    if (!rawFile) {
      message.warning("⚠️ Vui lòng chọn ảnh trước");
      return;
    }

    try {
      setDetecting(true);
      setFaceDescriptor(null);

      const descriptor = await getDescriptorFromImage(rawFile);

      if (!descriptor) {
        message.error("❌ Ảnh phải có đúng 1 khuôn mặt");
        return;
      }

      setFaceDescriptor(descriptor);
      message.success("✅ Nhận diện khuôn mặt thành công");
    } catch (e) {
      console.error(e);
      message.error("❌ Lỗi nhận diện khuôn mặt");
    } finally {
      setDetecting(false);
    }
  };

  /* ================= SUBMIT ================= */
  const onFinish = async (values) => {
    if (!editing && !faceDescriptor) {
      message.error("❌ Cần nhận diện khuôn mặt trước khi lưu");
      return;
    }

    const formData = new FormData();

    if (rawFile && faceDescriptor) {
      formData.append("image", rawFile);
      formData.append(
        "face_encoding",
        JSON.stringify(Array.from(faceDescriptor))
      );
    }

    Object.entries(values).forEach(([key, value]) => {
      if (!value || key === "image") return;
      if (key === "date_of_birth") {
        formData.append(key, value.format("YYYY-MM-DD"));
      } else {
        formData.append(key, value);
      }
    });

    if (editing) {
      await studentApi.update(editing.id, formData);
      message.success("✅ Cập nhật thành công");
    } else {
      await studentApi.create(formData);
      message.success("✅ Thêm học sinh thành công");
    }

    setOpen(false);
    setEditing(null);
    setPreview(null);
    setRawFile(null);
    setFaceDescriptor(null);
    form.resetFields();
    loadData(filters);
  };

  return (
    <>
      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm tên / mã"
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
        />
        <Select
          placeholder="Lớp"
          allowClear
          style={{ width: 180 }}
          onChange={(v) => setFilters({ ...filters, class_id: v })}
        >
          {classes.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={() => setOpen(true)}>
          ➕ Thêm học sinh
        </Button>
      </Space>

      <Table rowKey="id" columns={columns} dataSource={data} bordered />

      {/* MODAL */}
      <Modal
        open={open}
        title={editing ? "✏️ Cập nhật học sinh" : "➕ Thêm học sinh"}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          setPreview(null);
          setRawFile(null);
          setFaceDescriptor(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okButtonProps={{
          disabled: detecting || (!editing && !faceDescriptor),
        }}
        width={1100}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* ===== FORM GIỮ NGUYÊN ===== */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="student_code"
                label="Mã học sinh"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="class_id" label="Lớp">
                <Select>
                  {classes.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gender" label="Giới tính">
                <Select allowClear>
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="date_of_birth" label="Ngày sinh">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="phone" label="SĐT">
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">Ngưng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ===== UPLOAD + DETECT ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                onChange={(info) => {
                  const file = info.file.originFileObj;
                  if (!file) return;
                  setRawFile(file);
                  setPreview(URL.createObjectURL(file));
                  setFaceDescriptor(null);
                }}
              >
                + Ảnh
              </Upload>

              {preview && (
                <>
                  <img
                    src={preview}
                    style={{ width: 120, borderRadius: 8 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button
                      type="primary"
                      onClick={handleDetectFace}
                      loading={detecting}
                      icon={detecting ? <LoadingOutlined /> : null}
                    >
                      Nhận diện khuôn mặt
                    </Button>
                  </div>

                  <div style={{ marginTop: 6 }}>
                    {faceDescriptor ? (
                      <Tag color="green">✅ Đã nhận diện</Tag>
                    ) : (
                      <Tag color="orange">⏳ Chưa nhận diện</Tag>
                    )}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
