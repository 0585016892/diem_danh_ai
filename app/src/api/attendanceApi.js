import axios from "axios";

const attendanceApi = {
  auto: (payload) =>
    axios.post("http://localhost:20031/api/attendances/auto", payload),

  today: () =>
    axios.get("http://localhost:20031/api/attendances/today"),
};

export default attendanceApi;
