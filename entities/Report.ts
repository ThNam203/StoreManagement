import { FormType } from "./Transaction";

type Report = {
  headerData: {
    title: string;
    createdDate: Date;
    saleDate?: Date;
    rangeDate?: { startDate: Date; endDate: Date };
    branch: string;
  };
  columnHeaders: Record<string, string>;
  contentData: Array<any>;
};
type BusinessReport = {
  headerData: {
    title: string;
    createdDate: Date;
    saleDate?: Date;
    rangeDate?: { startDate: Date; endDate: Date };
    branch: string;
  };
  rowHeaders: Record<string, string>;
  contentData: Array<any>;
};

// type ReportDataType = SaleReport | FundReport | GoodsReport;

// type SaleReport = {
//   transactionId: any;
//   time: Date;
//   quantity: number;
//   revenue: number;
//   otherFees: number;
//   totalSale: number;
// };

// type FundReport = {
//   formId: any;
//   targetName: string;
//   formType: FormType;
//   time: Date;
// };

// type GoodsReport = {
//   goodsId: any;
//   goodsName: string;
//   sellQuantity: number;
//   revenue: number;
//   returnQuantity: number;
//   returnValue: number;
//   netRevenue: number;
// };

export enum DisplayType {
  CHART = "Chart",
  REPORT = "Report",
}
export enum Concern {
  REVENUE = "Revenue",
  PROFIT = "Profit",
  SALE = "Sale",
  DEBT = "Debt",
}

export type { Report, BusinessReport };
