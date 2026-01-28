const { Server } = require("socket.io");
const db = require("./db");

let io;

module.exports = {
  init: httpServer => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", socket => {
      console.log("🟢 Socket connected:", socket.id);

      // 🔥 GỬI TRẠNG THÁI CAMERA HIỆN TẠI TỪ DB
      db.query(
        "SELECT camera_enabled FROM system_settings WHERE id = 1",
        (err, rows) => {
          if (err) return;

          const enabled = rows[0]?.camera_enabled === 1;

          socket.emit(
            enabled
              ? "system:camera:on"
              : "system:camera:off"
          );
        }
      );
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io chưa được init");
    }
    return io;
  },
};
