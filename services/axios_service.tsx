import axios from "axios";

// https://cstores.azurewebsites.net

const baseURL = 'https://cstores.azurewebsites.net/';

const AxiosService = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});

export default AxiosService;