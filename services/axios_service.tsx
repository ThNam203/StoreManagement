import axios from "axios";

// https://cstores.azurewebsites.net

const baseURL = 'https://cstores.azurewebsites.net/api';

const AxiosService = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});

export default AxiosService;