export type StockCheck = {
    id: number,
    createdDate: string,
    creatorId: number,
    totalCountedStock: number,
    totalStock: number,
    products: StockCheckDetail[],
    totalValueDifference: number,
    note: string,
}

export type StockCheckDetail = {
    productId: number,
    countedStock: number,
    realStock: number,
    valueDifference: number,
}