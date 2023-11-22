import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const baseURL = "http://localhost:8080/";

const AxiosService = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const RefreshTokenAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    const response = await RefreshTokenAxios.post(
      "/api/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    return await Promise.resolve();
  } catch (refreshError) {
    return await Promise.reject(refreshError);
  }
};

// Instantiate the interceptor
createAuthRefreshInterceptor(AxiosService, refreshAuthLogic, {
  statusCodes: [403],
  retryInstance: AxiosService,
});

export default AxiosService;
