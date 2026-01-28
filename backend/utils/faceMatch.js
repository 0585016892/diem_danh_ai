function euclideanDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    sum += Math.pow(d1[i] - d2[i], 2);
  }
  return Math.sqrt(sum);
}

module.exports = (inputDescriptor, students) => {
  let minDistance = 1;
  let matchedStudent = null;

  students.forEach(s => {
    const dbDescriptor = JSON.parse(s.face_descriptor);
    const distance = euclideanDistance(inputDescriptor, dbDescriptor);

    if (distance < minDistance && distance < 0.45) {
      minDistance = distance;
      matchedStudent = s;
    }
  });

  return matchedStudent;
};
