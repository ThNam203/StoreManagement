import AxiosService from "./axios_service";
import { Discount, DiscountCode } from "@/entities/Discount";

export type UploadDiscountDataType = {
  name: string;
  description: string;
  status: boolean;
  value: number;
  maxValue: number | null;
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

const updateDiscount = (data: Discount) => {
  return AxiosService.put<Discount>(`/api/discounts/${data.id}`, data);
};

const deleteDiscount = (discountId: number) => {
  return AxiosService.delete(`/api/discounts/${discountId}`);
};

const generateDiscountCodes = (discountId: number, amount: number) => {
  return AxiosService.post<DiscountCode[]>(
    `/api/discounts/${discountId}/generate?amount=${amount}`
  );
};

const deleteDiscountCodes = (discountId: number, codeIds: number[]) => {
  return AxiosService.delete(`/api/discounts/${discountId}/code`, { data: codeIds });
};

const DiscountService = {
  uploadNewDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteDiscount,
  generateDiscountCodes,
  deleteDiscountCodes,
};

export default DiscountService;
