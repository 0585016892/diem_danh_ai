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

  /*modal */
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const handleView = async (id) => {
    try {
      const res = await studentApi.getOne(id);
      setViewData(res.data);
      setViewOpen(true);
    } catch (e) {
      message.error("Không lấy được thông tin học sinh");
    }
  };

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
    { title: "Giới tính", dataIndex: "gender",render: (v) => (v === "male" ? "Nam" : "Nữ"),},
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Tag color={r.status === "active" ? "green" : "red"}>
          {r.status === 'active' ? 'Đang học' : 'Ngưng học'}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
         <Button onClick={() => handleView(r.id)}>👁 Xem</Button>

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
          <Button danger onClick={() => remove(r.id)}> Xoá </Button>
        </Space>
      ),
    },
  ];
/* ================= DELETE ================= */ 
const remove = async (id) => { 
  Modal.confirm({ title: "Xoá học sinh?", onOk: async () => {
     await studentApi.remove(id); 
     message.success("Đã xoá"); 
     loadData(filters); }, }); }
     ;
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
      message.success("Nhận diện khuôn mặt thành công");
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
      message.success("Cập nhật thành công");
    } else {
      await studentApi.create(formData);
      message.success("Thêm học sinh thành công");
    }

    setOpen(false);
    setEditing(null);
    setPreview(null);
    setRawFile(null);
    setFaceDescriptor(null);
    form.resetFields();
    loadData(filters);
  };

  const [importOpen, setImportOpen] = useState(false);
const [excelFile, setExcelFile] = useState(null);
const [importing, setImporting] = useState(false);
const [importClass, setImportClass] = useState(null);

  return (
    <div style={{ padding: 16 }}>
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
        <Button onClick={() => setImportOpen(true)}>
          📥 Import Excel
        </Button>

      </Space>

      <Table rowKey="id" columns={columns} dataSource={data} bordered />
      <Modal
        open={viewOpen}
        title="📄 Thông tin học sinh"
        footer={null}
        width={1000}
        onCancel={() => {
          setViewOpen(false);
          setViewData(null);
        }}
      >
        {viewData && (
          <>
            {/* ===== CARD HEADER ===== */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: 16,
                background: "#fafafa",
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              {viewData.face_image ? (
                <img
                  src={`http://localhost:20031/uploads/students/${viewData.face_image}`}
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "3px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  👤
                </div>
              )}

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{viewData.name}</h3>
                <div style={{ color: "#888" }}>
                  Mã HS: {viewData.student_code} · Lớp: {viewData.class_name}
                </div>
              </div>

              <Tag
                color={viewData.status === "active" ? "green" : "red"}
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                {viewData.status === "active" ? "Đang học" : "Ngưng học"}
              </Tag>
            </div>

            {/* ===== INFO SECTION ===== */}
            <Row gutter={24}>
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                  }}
                >
                  <h4>🎓 Thông tin học sinh</h4>

                  <p><b>Giới tính:</b> {viewData.gender === 'male' ? 'Name' : 'Nữ' || "-"}</p>
                  <p>
                    <b>Ngày sinh:</b>{" "}
                    {viewData.date_of_birth
                      ? dayjs(viewData.date_of_birth).format("DD/MM/YYYY")
                      : "-"}
                  </p>
                  <p><b>Địa chỉ:</b> {viewData.address || "-"}</p>
                </div>
              </Col>

              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                  }}
                >
                  <h4>👨‍👩‍👧 Thông tin phụ huynh</h4>

                  <p><b>Tên:</b> {viewData.parent_name || "-"}</p>
                  <p><b>SĐT:</b> {viewData.phone || "-"}</p>
                  <p><b>Email:</b> {viewData.email || "-"}</p>
                  <p><b>Quan hệ:</b> {viewData.parent_relation === 'father' ? 'Bố' :'Mẹ' || "-"}</p>
                </div>
              </Col>
            </Row>

            {/* ===== NOTE ===== */}
            {viewData.note && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: 12,
                }}
              >
                <h4>📝 Ghi chú</h4>
                {viewData.note}
              </div>
            )}
          </>
        )}
      </Modal>


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
               <Form.Item name="parent_name" label="Họ tên phụ huynh">
                <Input />
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
               <Form.Item name="parent_relation" label="Quan hệ với học sinh">
                <Select>
                  <Select.Option value="father">Bố</Select.Option>
                  <Select.Option value="mother">Mẹ</Select.Option>
                  <Select.Option value="guardian">Người giám hộ</Select.Option>
                </Select>
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
             <Form.Item name="note" label="Ghi chú">
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập ghi chú về học sinh..."
                  showCount
                  maxLength={300}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </Form.Item>

            </Col>
          </Row>

          {/* ===== UPLOAD + DETECT ===== */}
          <Row gutter={16}>
            <Col span={6}>
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
                      <Tag color="green">Đã nhận diện</Tag>
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
      <Modal
  open={importOpen}
  title="📥 Import học sinh từ Excel"
  onCancel={() => {
    setImportOpen(false);
    setExcelFile(null);
    setImportClass(null);
  }}
  onOk={async () => {
    if (!excelFile) {
      message.warning("⚠️ Chọn file Excel");
      return;
    }
    if (!importClass) {
      message.warning("⚠️ Chọn lớp");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("class_id", importClass);

    try {
      setImporting(true);
      await studentApi.importExcel(formData);
      message.success("🎉 Import thành công");
      setImportOpen(false);
      setExcelFile(null);
      setImportClass(null);
      loadData(filters);
    } catch (e) {
      message.error("❌ Import thất bại");
    } finally {
      setImporting(false);
    }
  }}
  okText="Import"
  confirmLoading={importing}
>
  <Space direction="vertical" style={{ width: "100%" }}>
    <Select
      placeholder="Chọn lớp"
      style={{ width: "100%" }}
      value={importClass}
      onChange={setImportClass}
    >
      {classes.map((c) => (
        <Select.Option key={c.id} value={c.id}>
          {c.name}
        </Select.Option>
      ))}
    </Select>

    <Upload
      beforeUpload={() => false}
      accept=".xlsx,.xls"
      maxCount={1}
      onChange={(info) => {
        const file = info.file.originFileObj;
        if (file) setExcelFile(file);
      }}
    >
      <Button>📄 Chọn file Excel</Button>
    </Upload>

    {excelFile && (
      <Tag color="blue">📎 {excelFile.name}</Tag>
    )}

    <div style={{ fontSize: 12, color: "#888" }}>
      📌 File Excel gồm các cột:
      <br />
      <b>name | student_code | gender | date_of_birth | phone | email | address | status</b>
    </div>
  </Space>
      </Modal>

    </div>
  );
}
