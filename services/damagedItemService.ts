import { DamagedItemDocument } from "@/entities/DamagedItemDocument";
import AxiosService from "./axiosService";

const getAllDamagedItemDocuments = async () => {
  return AxiosService.get<DamagedItemDocument[]>("/api/damaged-items");
};

const uploadDamagedItemDocument = (data: any) => {
  return AxiosService.post<DamagedItemDocument>("/api/damaged-items", data);
};

const deleteDamagedItemDocument = (documentId: number) => {
  return AxiosService.delete(`/api/damaged-items/${documentId}`);
};

const DamagedItemService = {
  getAllDamagedItemDocuments,
  uploadDamagedItemDocument,
  deleteDamagedItemDocument,
};

export default DamagedItemService;
