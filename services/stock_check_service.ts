import {
  StockCheck,
  StockCheckDetail,
  StockCheckResponse,
} from "@/entities/StockCheck";
import AxiosService from "./axios_service";

const transformStockCheckResponse = (
  rawStockCheck: StockCheckResponse,
): StockCheck => {
  const products = rawStockCheck.products;
  const filledStockCheck = {
    ...rawStockCheck,
    stock: products
      .map((detail) => detail.price)
      .reduce((prev, cur) => cur + prev, 0),
    totalValue: products
      .map((detail) => detail.countedStock)
      .reduce((prev, cur) => cur + prev, 0),
    stockDifference: products
      .map((detail) => detail.countedStock - detail.realStock)
      .reduce((prev, cur) => cur + prev, 0),
    totalValueDifference: products
      .map((detail) => (detail.countedStock - detail.realStock) * detail.price)
      .reduce((prev, cur) => cur + prev, 0),
    products: products.map((detail) => ({
      ...detail,
      diffQuantity: detail.countedStock - detail.realStock,
      diffCost: (detail.countedStock - detail.realStock) * detail.price,
    })),
  };
  return filledStockCheck;
};

const getAllStockChecks = async () => {
  try {
    const data =
      await AxiosService.get<StockCheckResponse[]>("/api/stock-checks");
    const filledData: StockCheck[] = data.data.map((rawStockCheck) =>
      transformStockCheckResponse(rawStockCheck),
    );
    return Promise.resolve(filledData);
  } catch (e) {
    return Promise.reject(e);
  }
};

const uploadNewStockCheck = async (data: {
  products: {
    productId: number;
    countedStock: number;
    realStock: number;
    price: number;
  }[];
  note: string;
}) => {
  try {
    const result = await AxiosService.post<StockCheckResponse>("/api/stock-checks", data);
    return Promise.resolve(transformStockCheckResponse(result.data));
  } catch (e) {
    return Promise.reject(e);
  }
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
