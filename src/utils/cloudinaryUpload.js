import axios from "axios";

const CloudinaryUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  const res = await axios.post(
    process.env.REACT_APP_CLOUDINARY_BASE_URL,
    formData
  );
  return res.data.url;
};

export default CloudinaryUpload;
