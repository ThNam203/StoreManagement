import {
  StockCheck,
  StockCheckDetail,
  StockCheckResponse,
} from "@/entities/StockCheck";
import AxiosService from "./axios_service";
import { Product } from "@/entities/Product";

const getAllStockChecks = async (products: Product[]) => {
  try {
    const data = await AxiosService.get<StockCheckResponse[]>(
      "/api/stock-checks"
    );
    const filledData: StockCheck[] = data.data.map((rawStockCheck) => {
      const filledStockCheck = {
        ...rawStockCheck,
        stock: rawStockCheck.products
          .map((detail) => detail.price)
          .reduce((prev, cur) => cur + prev, 0),
        totalValue: rawStockCheck.products
          .map((detail) => detail.countedStock)
          .reduce((prev, cur) => cur + prev, 0),
        stockDifference: rawStockCheck.products
          .map((detail) => detail.countedStock - detail.realStock)
          .reduce((prev, cur) => cur + prev, 0),
        totalValueDifference: rawStockCheck.products
          .map(
            (detail) => (detail.countedStock - detail.realStock) * detail.price
          )
          .reduce((prev, cur) => cur + prev, 0),
        products: rawStockCheck.products.map((detail) => ({
          ...detail,
          diffQuantity: detail.countedStock - detail.realStock,
          diffCost: (detail.countedStock - detail.realStock) * detail.price,
        })),
      };
      return filledStockCheck;
    });
    return Promise.resolve(filledData);
  } catch (e) {
    return Promise.reject(e);
  }
};

const uploadNewStockCheck = (data: {
  products: {
    productId: number,
    countedStock: number,
    realStock: number,
    price: number,
  }[],
  note: string,
}) => {
  return AxiosService.post<any>("/api/stock-checks", data);
};

const updateStockCheck = (data: StockCheck) => {
  return AxiosService.put<StockCheck>(`/api/stock-checks/${data.id}`, data);
};

const deleteStockCheck = (StockCheckId: number) => {
  return AxiosService.delete(`/api/stock-checks/${StockCheckId}`);
};

const StockCheckService = {
  getAllStockChecks,
  uploadNewStockCheck,
  updateStockCheck,
  deleteStockCheck,
};

export default StockCheckService;
