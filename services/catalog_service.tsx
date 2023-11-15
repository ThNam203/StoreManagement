import AxiosService from "./axios_service";

const createNewGroup = (value: string) => {
  return AxiosService.post("/api/groups", {
    name: value,
  });
};

const getAllGroup = () => {
  return AxiosService.get<string[]>("/api/groups");
};

const createNewLocation = (value: string) => {
  return AxiosService.post("/api/locations", {
    name: value,
  });
};

const getAllLocations = () => {
  return AxiosService.get<string[]>("/api/locations");
};

const createNewBrand = (value: string) => {
  return AxiosService.post("/api/product-brands", {
    name: value,
  });
};

const getAllBrand = () => {
  return AxiosService.get<string[]>("/api/product-brands");
};

const createNewProperty = (value: string) => {
  return AxiosService.post("/api/product-properties", {
    name: value,
  });
};

const getAllProperty = () => {
  return AxiosService.get<string[]>("/api/product-properties");
};

const CatalogService = {
  createNewLocation,
  getAllLocations,
  createNewBrand,
  getAllBrand,
  createNewProperty,
  getAllProperty,
  createNewGroup,
  getAllGroup
};

export default CatalogService;
