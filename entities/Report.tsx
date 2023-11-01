export type DailyReport = {
  headerData: {
    createdDate: Date;
    saleDate: Date;
    branch: string;
  };
  contentData: Array<DataTableDailyReport>;
};

export type DataTableDailyReport = {
  transactionId: any;
  time: Date;
  quantity: number;
  revenue: number;
  otherFees: number;
  totalSale: number;
};
