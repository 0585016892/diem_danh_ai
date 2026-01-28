import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Card, Select, Table, Typography, Row, Col, Alert } from "antd";
import io from "socket.io-client";
import attendanceApi from "../api/attendanceApi";
import systemApi from "../api/systemApi";

const socket = io("http://localhost:20031");
const { Title } = Typography;

export default function Attendance() {
  const videoRef = useRef(null);
  const scanning = useRef(false);
  const intervalRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [systemOn, setSystemOn] = useState(false);

  const [list, setList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);

  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState(null);

  /* ================= LOAD SYSTEM STATUS ================= */
  useEffect(() => {
    const initSystem = async () => {
      try {
        console.log("🔄 Fetch camera status...");
        const res = await systemApi.getCameraStatus();
        const enabled = !!res.data.camera_enabled;

        console.log("📷 Camera enabled:", enabled);
        setSystemOn(enabled);
        setStatus(enabled ? "ready" : "off");
      } catch (err) {
        console.error("❌ System status error", err);
        setSystemOn(false);
        setStatus("off");
      }
    };
    initSystem();
  }, []);

  /* ================= LOAD MODELS + DATA ================= */
  useEffect(() => {
    const init = async () => {
      console.log("🤖 Loading face-api models...");
      const MODEL_URL = "/models";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      console.log("✅ Models loaded");

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === "videoinput");
      setCameras(cams);
      setCameraId(cams[0]?.deviceId || null);

      setClasses([
        { id: 1, name: "Lớp CNTT 1" },
        { id: 2, name: "Lớp CNTT 2" },
      ]);
      setClassId(1);

      const today = await attendanceApi.today();
      setList(today.data || []);
    };

    init();
  }, []);

  /* ================= CAMERA STREAM ================= */
  useEffect(() => {
    if (!cameraId || !systemOn) return;

    console.log("🎥 Start camera");

    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: { exact: cameraId } } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });

    return () => {
      console.log("🛑 Stop camera");
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraId, systemOn]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.on("system:camera:on", () => {
      console.log("📡 SOCKET camera ON");
      setSystemOn(true);
      setStatus("ready");
    });

    socket.on("system:camera:off", () => {
      console.log("📡 SOCKET camera OFF");
      setSystemOn(false);
      setStatus("off");

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    });

    socket.on("attendance:new", data => {
      console.log("📡 New attendance", data);
      setList(prev => [data, ...prev]);
    });

    return () => {
      socket.off("system:camera:on");
      socket.off("system:camera:off");
      socket.off("attendance:new");
    };
  }, []);

  /* ================= FACE SCAN ================= */
  const onPlay = () => {
    if (!systemOn || intervalRef.current) return;

    console.log("▶️ Start scanning");

    intervalRef.current = setInterval(async () => {
      if (!systemOn || scanning.current || !videoRef.current) return;

      const video = videoRef.current;
      if (video.readyState < 2) return;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.6 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) return;

      scanning.current = true;
      setStatus("detecting");

      console.log("🙂 Face detected");

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      try {
        await attendanceApi.auto({
          class_id: classId,
          descriptor: Array.from(detection.descriptor),
          image: canvas.toDataURL("image/jpeg"),
        });

        console.log("✅ Attendance success");
        setStatus("success");
      } catch (err) {
        console.warn("❌ Attendance failed", err?.response?.data);
        setStatus(err?.response?.data?.duplicated ? "duplicated" : "failed");
      }

      setTimeout(() => {
        scanning.current = false;
        setStatus("ready");
      }, 2000);
    }, 1000);
  };

  /* ================= UI ================= */
  return (
    <div className="dark-attendance" style={{padding:16}}>
    <Row gutter={24}>
      <Col span={14}>
        <Card className="ai-card">
          <Title level={4}>🎓 Điểm danh khuôn mặt</Title>

          <Row gutter={12}>
            <Col span={12}>
              <Select
                value={classId}
                onChange={setClassId}
                style={{ width: "100%" }}
                options={classes.map(c => ({ label: c.name, value: c.id }))}
              />
            </Col>
            <Col span={12}>
              <Select
                value={cameraId}
                onChange={setCameraId}
                style={{ width: "100%" }}
                options={cameras.map(c => ({
                  label: c.label || "Camera",
                  value: c.deviceId,
                }))}
              />
            </Col>
          </Row>

          {!systemOn ? (
            <Alert
              style={{ marginTop: 20 }}
              type="warning"
              showIcon
              message="Hệ thống điểm danh đang tắt"
            />
          ) : (
            <div className={`camera-wrapper ${status}`}>
              <video ref={videoRef} autoPlay muted onPlay={onPlay} />

              <div className="ai-overlay">
                <div className="corner tl" />
                <div className="corner tr" />
                <div className="corner bl" />
                <div className="corner br" />
                {status === "detecting" && <div className="scan-line" />}
              </div>

              <div className={`status-chip ${status}`}>
                {{
                  ready: "🟢 Sẵn sàng quét",
                  detecting: "🔍 Đang nhận diện",
                  success: "✅ Thành công",
                  failed: "❌ Không khớp",
                  duplicated: "⚠️ Đã điểm danh",
                }[status]}
              </div>
            </div>
          )}
        </Card>
      </Col>

      <Col span={10}>
        <Card className="ai-card">
          <Title level={4}>📋 Danh sách hôm nay</Title>

          <Table
            size="small"
            pagination={false}
            rowKey={(r, i) => i}
            rowClassName="attendance-row"
            dataSource={list}
            columns={[
              {
                title: "Sinh viên",
                dataIndex: "image",
                render: (img, r) => (
                  <div className="student-cell">
                    <img
                      src={`http://localhost:20031${img}`}
                      className="avatar"
                      alt=""
                    />
                    <div>
                      <div className="name">{r.name}</div>
                      <div className="time">
                        ⏰ {new Date(r.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ),
              },
             {
                title: "Trạng thái",
                dataIndex: "status",
                render: (s) => {
                  let text = "✖ Vắng";
                  let cls = "absent";

                  if (s === "present") {
                    text = "✔ Đã điểm danh";
                    cls = "present";
                  }

                  if (s === "late") {
                    text = "⏰ Đến muộn";
                    cls = "late";
                  }

                  return <span className={`tag ${cls}`}>{text}</span>;
                },
              },

            ]}
          />
        </Card>
      </Col>

      {/* ================= STYLE ================= */}
      <style>{`
      .tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.tag.present {
  background: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.tag.late {
  background: #fff7e6;
  color: #d46b08;
  border: 1px solid #ffd591;
}

.tag.absent {
  background: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

        .ai-card {
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,.12);
        }

        .camera-wrapper {
          position: relative;
          height: 380px;
          margin-top: 16px;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          transition: box-shadow .3s ease;
        }

        .camera-wrapper.success { box-shadow: 0 0 40px rgba(82,196,26,.9); }
        .camera-wrapper.failed { box-shadow: 0 0 40px rgba(255,77,79,.9); animation: shake .4s; }
        .camera-wrapper.duplicated { box-shadow: 0 0 40px rgba(250,173,20,.9); }

        video { width: 100%; height: 100%; object-fit: cover; }

        .ai-overlay { position: absolute; inset: 0; pointer-events: none; }

        .corner {
          position: absolute;
          width: 28px;
          height: 28px;
          border: 3px solid #00ffcc;
        }

        .tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
        .tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
        .bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
        .br { bottom: 20px; right: 20px; border-left: none; border-top: none; }

        .scan-line {
          position: absolute;
          left: 20%;
          right: 20%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00ffcc, transparent);
          animation: scan 1.8s linear infinite;
        }

        @keyframes scan { from { top: 15%; } to { top: 85%; } }

        .status-chip {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          border-radius: 999px;
          background: rgba(0,0,0,.6);
          color: white;
          font-weight: 600;
        }

        .attendance-row:hover { background: #f5f7fa; }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .name { font-weight: 600; }
        .time { font-size: 12px; color: #888; }

        .tag {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
        }

        .tag.present { background: #f6ffed; color: #52c41a; }
        .tag.absent { background: #fff1f0; color: #ff4d4f; }

        @keyframes shake {
          0% { transform: translateX(-50%); }
          25% { transform: translateX(-50%) translateX(-6px); }
          50% { transform: translateX(-50%) translateX(6px); }
          75% { transform: translateX(-50%) translateX(-4px); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Row>
    </div>

  );
}
