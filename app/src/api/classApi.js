import axiosClient from "./axiosClient";

export default {
  getAll: (params) => axiosClient.get("/classes", { params }),
  create: (data) => axiosClient.post("/classes", data),
  update: (id, data) => axiosClient.put(`/classes/${id}`, data),
  updateStatus: (id, status) =>
    axiosClient.put(`/classes/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/classes/${id}`),
};
