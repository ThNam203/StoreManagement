import { FormType } from "./Transaction";

type DailyReport = {
  headerData: {
    title: string;
    createdDate: Date;
    saleDate: Date;
    branch: string;
  };
  columnHeaders: Record<string, string>;
  contentData: Array<ReportDataType>;
};

type ReportDataType = SaleReport | FundReport | GoodsReport;

type SaleReport = {
  transactionId: any;
  time: Date;
  quantity: number;
  revenue: number;
  otherFees: number;
  totalSale: number;
};

type FundReport = {
  formId: any;
  targetName: string;
  formType: FormType;
  time: Date;
};

type GoodsReport = {
  goodsId: any;
  goodsName: string;
  sellQuantity: number;
  revenue: number;
  returnQuantity: number;
  returnValue: number;
  netRevenue: number;
};

export type {
  DailyReport,
  ReportDataType,
  SaleReport,
  FundReport,
  GoodsReport,
};
