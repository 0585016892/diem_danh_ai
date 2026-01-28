import { Card } from "antd";

export default function StatCard({ title, value, icon, color }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            color: "#fff",
          }}
        >
          {icon}
        </div>

        <div>
          <div style={{ fontSize: 14, color: "#888" }}>{title}</div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}
