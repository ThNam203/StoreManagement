import AxiosService from "./axios_service";
import { Discount } from "@/entities/Discount";

export type UploadDiscountDataType = {
  name: string;
  description: string;
  status: boolean;
  value: number;
  type: "VOUCHER" | "COUPON";
  amount: number;
  productIds: number[] | null;
  productGroups: string[] | null;
  startDate: string;
  endDate: string;
};

const getAllDiscounts = () => {
  return AxiosService.get<Discount[]>("/api/discounts");
};

const uploadNewDiscount = (data: UploadDiscountDataType) => {
  return AxiosService.post<Discount>("/api/discounts", data);
};

const DiscountService = { uploadNewDiscount,getAllDiscounts };

export default DiscountService;
