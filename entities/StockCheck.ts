export type StockCheck = {
  id: number;
  createdDate: string;
  creatorId: number;
  totalCountedStock: number;
  totalStock: number;
  totalValue: number;
  stockDifference: number;
  totalValueDifference: number;
  products: StockCheckDetail[];
  note: string;
};

export type StockCheckDetail = {
  productId: number;
  productName: string;
  productProperties: string;
  unitName: string;
  diffQuantity: number;
  diffCost: number;
  countedStock: number;
  realStock: number;
  price: number;
};

export type StockCheckResponse = {
  id: number;
  createdDate: string;
  creatorId: number;
  products: StockCheckDetailResponse[];
  note: string;
};

export type StockCheckDetailResponse = {
  productId: number;
  productName: string;
  productProperties: string;
  unitName: string;
  propertiesString: string;
  countedStock: number;
  realStock: number;
  price: number;
};
