import axiosClient from "./axiosClient";

const studentApi = {
  getAll: (params) => axiosClient.get("/students", { params }),
  create: (data) => axiosClient.post("/students", data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  remove: (id) => axiosClient.delete(`/students/${id}`),
  importExcel(data) {
  return axiosClient.post("/students/import-excel", data);
} 
};

export default studentApi;
