import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để theo dõi trạng thái làm mới token
let isRefreshing = false;
// Hàng đợi các request đang chờ token mới
let failedQueue: any[] = [];

// Xử lý hàng đợi các request đang chờ
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor để chèn token vào header (nếu có)
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response và làm mới token khi cần
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Nếu không có config hoặc không có response, reject luôn
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // Nếu lỗi không phải 401 hoặc đã thử làm mới token rồi, reject luôn
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Đánh dấu request này đã thử làm mới token
    originalRequest._retry = true;

    // Nếu đang trong quá trình làm mới token, thêm request vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          if (token) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`
            };
          }
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = Cookies.get('refreshToken');

      // Nếu không có refresh token, đăng xuất
      if (!refreshToken) {
        // Xóa token
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        // Xử lý hàng đợi với lỗi
        processQueue(error);

        return Promise.reject(error);
      }

      // Gọi API làm mới token
      const response = await axiosInstance.post(`${baseURL}/api/auth/refresh-token`, {
        refreshToken
      });

      if (response.data.success) {
        const { token, refreshToken: newRefreshToken } = response.data.data;

        // Lưu token mới
        Cookies.set('accessToken', token, {
          expires: 1, // 1 ngày
          path: '/',
          sameSite: 'strict'
        });
        Cookies.set('refreshToken', newRefreshToken, {
          expires: 7, // 7 ngày
          path: '/',
          sameSite: 'strict'
        });

        // Cập nhật header cho request gốc
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`
        };

        // Xử lý hàng đợi với token mới
        processQueue(null, token);

        // Thử lại request gốc
        return axiosInstance(originalRequest);
      } else {
        // Nếu làm mới token thất bại, đăng xuất
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        // Xử lý hàng đợi với lỗi
        processQueue(error);

        return Promise.reject(error);
      }
    } catch (refreshError) {
      // Nếu có lỗi khi làm mới token, đăng xuất
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      // Xử lý hàng đợi với lỗi
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
