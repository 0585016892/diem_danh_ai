import axiosClient from "./axiosClient";

const dashboardApi = {
  getAll() {
    return axiosClient.get("/dashboard/stats");
  },
};

export default dashboardApi;
