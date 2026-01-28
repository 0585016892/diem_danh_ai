import axios from "./axiosClient";

const reportsApi = {
  /* ======================
     TỔNG QUAN HÔM NAY
  ======================= */
  overview: () => axios.get("/reports/overview"),

  /* ======================
     BÁO CÁO THEO LỚP
  ======================= */
  reportByClass: (classId, from, to) =>
    axios.get(`/reports/class/${classId}`, {
      params: { from, to },
    }),

  /* ======================
     BÁO CÁO THEO SINH VIÊN
  ======================= */
  reportByStudent: (studentId) =>
    axios.get(`/reports/student/${studentId}`),

  /* ======================
     🔥 ĐI MUỘN
  ======================= */

  // Tổng số lượt đi muộn (toàn hệ thống / hôm nay)
  lateOverview: () =>
    axios.get("/reports/late/overview"),

  // Đi muộn theo lớp + khoảng ngày
  lateByClass: (classId, from, to) =>
    axios.get(`/reports/late/class/${classId}`, {
      params: { from, to },
    }),

  // Top sinh viên đi muộn nhiều nhất
  lateTop: () =>
    axios.get("/reports/late/top"),
};

export default reportsApi;
