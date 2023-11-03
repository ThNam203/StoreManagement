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

type ReportDataType = SaleReport | FundReport | InventoryReport;

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

type InventoryReport = {};

export type {
  DailyReport,
  ReportDataType,
  SaleReport,
  FundReport,
  InventoryReport,
};
