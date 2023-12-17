import {
  Product,
  ProductBrand,
  ProductGroup,
  ProductLocation,
  ProductProperty,
} from "@/entities/Product";
import AxiosService from "./axios_service";

const createNewGroup = (value: string) => {
  return AxiosService.post<ProductGroup>("/api/product-groups", {
    name: value,
  });
};

const getAllGroups = () => {
  return AxiosService.get<ProductGroup[]>("/api/product-groups");
};

const createNewLocation = (value: string) => {
  return AxiosService.post<ProductLocation>("/api/locations", {
    name: value,
  });
};

const getAllLocations = () => {
  return AxiosService.get<ProductLocation[]>("/api/locations");
};

const createNewBrand = (value: string) => {
  return AxiosService.post<ProductBrand>("/api/product-brands", {
    name: value,
  });
};

const getAllBrands = () => {
  return AxiosService.get<ProductBrand[]>("/api/product-brands");
};

const createNewProperty = (value: string) => {
  return AxiosService.post<ProductProperty>("/api/product-property-names", {
    name: value,
  });
};

const updateProperty = (value: string, id: number) => {
  return AxiosService.put<ProductProperty>(
    `/api/product-property-names/${id}`,
    {
      name: value,
    },
  );
};

const deleteProperty = (id: number) => {
  return AxiosService.delete(`/api/product-property-names/${id}`);
};

const getAllProperties = () => {
  return AxiosService.get<ProductProperty[]>("/api/product-property-names");
};

const getAllProducts = () => {
  return AxiosService.get<Product[]>("/api/products").then((result) => {
    result.data.forEach((product) => {
      product.propertiesString = product.productProperties
        ?.map((property) => property.propertyValue)
        .join(" - ");
    });

    return Promise.resolve(result);
  });
};

const createNewProduct = (data: any) => {
  return AxiosService.post<Product[]>("/api/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateProduct = (productData: any, imageFiles: File[] | null) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(productData)], { type: "application/json" }),
  );
  if (imageFiles && imageFiles.length > 0)
    imageFiles.forEach((imageFile) => formData.append("files", imageFile));

  return AxiosService.put<Product>(
    `/api/products/${productData.id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

const deleteProduct = (id: number) => {
  return AxiosService.delete<Product>(`/api/products/${id}`);
};

const ProductService = {
  createNewLocation,
  getAllLocations,
  createNewBrand,
  getAllBrands,
  createNewProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  createNewGroup,
  getAllGroups,
  createNewProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};

export default ProductService;
