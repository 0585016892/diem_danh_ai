import * as faceapi from "face-api.js";

let isLoaded = false;

export const loadFaceModels = async () => {
  if (isLoaded) return;

  const MODEL_URL = "/models";

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);

  isLoaded = true;
  console.log("✅ Face models loaded");
};

export const getDescriptorFromImage = async (file) => {
  await loadFaceModels();

  const img = await faceapi.bufferToImage(file);

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;

  return detection.descriptor;
};
