import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchData = async (url) => {
  const { data } = await apiClient.get(url);
  return data;
};

export const postData = async (url, body) => {
  const { data } = await apiClient.post(url, body);
  return data;
};

export const putData = async (url, body) => {
  console.log(url, body);
  const { data } = await apiClient.put(url, body);
  return data;
};

export const deleteData = async (url) => {
  const { data } = await apiClient.delete(url);
  return data;
};

export default fetchData;
