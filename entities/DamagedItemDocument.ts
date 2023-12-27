export type DamagedItemDocument = {
    id: number;
    note: string;
    createdDate: string;
    products: DamagedItemDetail[];
    creatorId: number;
};

export type DamagedItemDetail = {
    productId: number;
    quantity: number;
    price: number;
};
  