import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications() {
    return axiosClient.get("/notifications");
  },
  markRead(id) {
    return axiosClient.put(`/notifications/${id}/read`);
  },
  markAllRead() {
    return axiosClient.put("/notifications/read-all");
  },
};

export default notificationApi;
