import axiosClient from "./axiosClient";

const teacherApi = {
  getMyClasses() {
    return axiosClient.get("/users/my-class");
  },

   getStudentsByClass(classId, date) {
  return axiosClient.get(
    `/users/classes/${classId}/students`,
    {
      params: { date }
    }
  );
}

};

export default teacherApi;
