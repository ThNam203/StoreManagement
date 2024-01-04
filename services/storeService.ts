import { Store } from "@/entities/Store";
import AxiosService from "./axiosService";

const getStoreInformation = () => {
    return AxiosService.get<Store>("/api/store")
};

const updateStoreInformation = (data: Store) => {
    return AxiosService.put<Store>("/api/store", data)
}

const StoreService = {
    getStoreInformation,
    updateStoreInformation
}

export default StoreService;