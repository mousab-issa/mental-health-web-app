import axios from "axios";

const CloudinaryUpload = async (file, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  const res = await axios.post(
    type === "image"
      ? process.env.REACT_APP_CLOUDINARY_BASE_URL
      : process.env.REACT_APP_CLOUDINARY_VIDEO_BASE_URL,
    formData
  );
  return res.data.url;
};

export default CloudinaryUpload;
