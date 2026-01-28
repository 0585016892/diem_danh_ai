import axiosClient from "./axiosClient";

const systemApi = {
  getCameraStatus() {
    return axiosClient.get("/admin/camera/status");
  },

  toggleCamera(enabled) {
    return axiosClient.post("/admin/camera/toggle", { enabled });
  },
};

export default systemApi;
