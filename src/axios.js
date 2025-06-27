import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

export default instance
