import axiosClient from "./axiosClient";

const userApi = {
  getAll(params) {
  return axiosClient.get("/users", { params });
},

  create: (data) => axiosClient.post("/users", data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),

  updateStatus: (id, status) =>
    axiosClient.patch(`/users/${id}/status`, { status }),

  remove: (id) => axiosClient.delete(`/users/${id}`),
  getTeachers: () => axiosClient.get("/users/teachers"),
getProfile() {
    return axiosClient.get("/users/me");
  },

  updateProfile(data) {
    return axiosClient.put("/users/me", data);
  },

  changePassword(data) {
    return axiosClient.put("/users/me/password", data);
  },
};

export default userApi;
