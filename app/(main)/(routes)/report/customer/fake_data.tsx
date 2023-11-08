const originalPurchasedProductCustomerChartData = [
  {
    label: "John",
    value: 15,
  },
  {
    label: "Mary",
    value: 10,
  },
  {
    label: "David",
    value: 14,
  },
  {
    label: "Tom",
    value: 9,
  },
  {
    label: "Jerry",
    value: 5,
  },
  {
    label: "Gay",
    value: 20,
  },
];
const originalDebtCustomerChartData = [
  {
    label: "Alice",
    value: 100000,
  },
  {
    label: "Hary",
    value: 200000,
  },
  {
    label: "Victor",
    value: 250000,
  },
  {
    label: "Sam",
    value: 900000,
  },
  {
    label: "Luffy",
    value: 1500000,
  },
  {
    label: "Zoro",
    value: 2000000,
  },
];

const originalProfitByCustomerList = [
  {
    customer: "John",
    totalRevenue: 10000000,
    discount: 1000000,
    revenue: 9000000,
    returnValue: 0,
    netRevenue: 8000000,
    totalCost: 1000000,
    profit: 8000000,
  },
];
const originalDebtByCustomerList = [
  {
    id: 1,
    customerName: "Mary",
    beginningDebt: 0,
    recordDebt: 100000,
    endingDebt: 100000,
  },
];
const originalSaleByCustomerList = [
  {
    id: 1,
    customerName: "David",
    revenue: 1000000,
    returnValue: 0,
    netRevenue: 1000000,
  },
];

export {
  originalDebtByCustomerList,
  originalProfitByCustomerList,
  originalSaleByCustomerList,
  originalPurchasedProductCustomerChartData,
  originalDebtCustomerChartData,
};
