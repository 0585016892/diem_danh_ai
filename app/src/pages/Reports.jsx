import { useEffect, useState } from "react";
import {
  Tabs,
  Card,
  DatePicker,
  Select,
  Button,
  Table,
  Row,
  Col,
  Statistic,
  message,
  Tag,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import reportsApi from "../api/reportsApi";
import classesApi from "../api/classApi";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function Reports() {
  const [overview, setOverview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [range, setRange] = useState([]);
  const [classReport, setClassReport] = useState([]);
  const [lateOverview, setLateOverview] = useState(null);
  const [lateByClass, setLateByClass] = useState([]);
  const [lateTop, setLateTop] = useState([]);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchOverview();
    fetchLateOverview();
    fetchLateTop();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await classesApi.getAll();
    setClasses(res.data);
  };

  /* ================= OVERVIEW ================= */
  const fetchOverview = async () => {
    const res = await reportsApi.overview();
    setOverview(res.data);
  };

  /* ================= CLASS REPORT ================= */
  const fetchClassReport = async () => {
    if (!classId || range.length !== 2)
      return message.warning("Chọn lớp & khoảng ngày");

    const res = await reportsApi.reportByClass(
      classId,
      range[0].format("YYYY-MM-DD"),
      range[1].format("YYYY-MM-DD")
    );
    setClassReport(res.data);
  };

  /* ================= LATE REPORT ================= */
  const fetchLateOverview = async () => {
    const res = await reportsApi.lateOverview();
    setLateOverview(res.data);
  };

  const fetchLateByClass = async () => {
    if (!classId || range.length !== 2)
      return message.warning("Chọn lớp & khoảng ngày");

    const res = await reportsApi.lateByClass(
      classId,
      range[0].format("YYYY-MM-DD"),
      range[1].format("YYYY-MM-DD")
    );
    setLateByClass(res.data);
  };

  const fetchLateTop = async () => {
    const res = await reportsApi.lateTop();
    setLateTop(res.data);
  };

  /* ================= EXPORT ================= */
  const exportExcel = () => {
    if (!classId || range.length !== 2)
      return message.warning("Chọn lớp & khoảng ngày");

    window.open(
      `/api/reports/export/excel?classId=${classId}&from=${range[0].format(
        "YYYY-MM-DD"
      )}&to=${range[1].format("YYYY-MM-DD")}`,
      "_blank"
    );
  };

  /* ================= TABLE ================= */
  const classColumns = [
    { title: "Sinh viên", dataIndex: "name" },
    { title: "Có mặt", dataIndex: "present" },
    { title: "Muộn", dataIndex: "late" },
    { title: "Vắng", dataIndex: "absent" },
  ];

  const lateColumns = [
    { title: "Sinh viên", dataIndex: "name" },
    { title: "Mã SV", dataIndex: "student_code" },
    {
      title: "Số lần muộn",
      dataIndex: "late_count",
      render: (v) => <Tag color="orange">{v}</Tag>,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <Tabs
          items={[
            /* ================= TAB 1 ================= */
            {
              key: "1",
              label: "📊 Tổng quan",
              children: overview && (
                <Row gutter={24}>
                  <Col span={6}>
                    <Statistic title="Tổng lượt" value={overview.total} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Có mặt" value={overview.present} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Muộn" value={overview.late} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Vắng" value={overview.absent} />
                  </Col>
                </Row>
              ),
            },

            /* ================= TAB 2 ================= */
            {
              key: "2",
              label: "🏫 Theo lớp",
              children: (
                <>
                  <FilterRow
                    classes={classes}
                    setClassId={setClassId}
                    setRange={setRange}
                    onStat={fetchClassReport}
                    onExport={exportExcel}
                  />

                  <ResponsiveContainer height={320}>
                    <BarChart data={classReport}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="#52c41a" />
                      <Bar dataKey="late" fill="#faad14" />
                      <Bar dataKey="absent" fill="#ff4d4f" />
                    </BarChart>
                  </ResponsiveContainer>

                  <Table
                    rowKey="id"
                    columns={classColumns}
                    dataSource={classReport}
                    style={{ marginTop: 16 }}
                  />
                </>
              ),
            },

            /* ================= TAB 3 ================= */
            {
              key: "3",
              label: "⏰ Đi muộn",
              children: (
                <>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Statistic
                        title="Tổng lượt đi muộn"
                        value={lateOverview?.total_late}
                      />
                    </Col>
                  </Row>

                  <FilterRow
                    classes={classes}
                    setClassId={setClassId}
                    setRange={setRange}
                    onStat={fetchLateByClass}
                  />

                  <Table
                    rowKey="id"
                    columns={lateColumns}
                    dataSource={lateByClass}
                  />
                </>
              ),
            },

            /* ================= TAB 4 ================= */
            {
              key: "4",
              label: "🏆 Top đi muộn",
              children: (
                <Table
                  rowKey="id"
                  columns={[
                    { title: "Sinh viên", dataIndex: "name" },
                    { title: "Lớp", dataIndex: "class_name" },
                    {
                      title: "Số lần muộn",
                      dataIndex: "late_count",
                      render: (v) => <Tag color="red">{v}</Tag>,
                    },
                  ]}
                  dataSource={lateTop}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

/* ================= FILTER COMPONENT ================= */
function FilterRow({ classes, setClassId, setRange, onStat, onExport }) {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Select
          placeholder="Chọn lớp"
          style={{ width: "100%" }}
          options={classes.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onChange={setClassId}
        />
      </Col>

      <Col span={10}>
        <RangePicker onChange={setRange} />
      </Col>

      <Col span={8}>
        <Button type="primary" onClick={onStat}>
          Thống kê
        </Button>
        {onExport && (
          <Button style={{ marginLeft: 8 }} onClick={onExport}>
            Xuất Excel
          </Button>
        )}
      </Col>
    </Row>
  );
}
