import { Supplier, SupplierGroup } from "@/entities/Supplier";
import AxiosService from "./axios_service";

const uploadSupplier = (data: any) => {
  return AxiosService.post<Supplier>("/api/suppliers", data);
};

const uploadSupplierGroup = (groupName: string) => {
  return AxiosService.post<SupplierGroup>("/api/supplier-groups", {
    name: groupName,
    // description: null,
  });
};

const updateSupplier = (supplierData: FormData, supplierId: number) => {
  return AxiosService.put<Supplier>(`/api/suppliers/${supplierId}`, supplierData);
};

const getAllSupplierGroups = () => {
  return AxiosService.get<SupplierGroup[]>("/api/supplier-groups");
};

const getAllSuppliers = () => {
  return AxiosService.get<Supplier[]>("/api/suppliers");
};

const deleteSupplier = (supplierId: number) => {
  return AxiosService.delete<Supplier>(`/api/suppliers/${supplierId}`);
};

const SupplierService = {
    uploadSupplier,
    uploadSupplierGroup,
    updateSupplier,
    getAllSupplierGroups,
    getAllSuppliers,
    deleteSupplier,
};

export default SupplierService;
