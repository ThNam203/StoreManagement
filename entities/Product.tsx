type Product = {
  id: number;
  name: string;
  barcode: string;
  location: string;
  originalPrice: number; // originalPrice
  productPrice: number;
  stock: number;
  status: string;
  weight: number;
  description: string;
  note: string;
  minStock: number; // minstock
  maxStock: number; // maxstock
  productGroup: string;
  productBrand: string;
  productProperties: {
    id: number;
    propertyName: string;
    propertyValue: string;
  }[];
  images: string[];
  salesUnits: {
    /// why does it have "s"
    id: number;
    basicUnit: string;
    name: string;
    exchangeValue: number;
  };
};

type ProductGroup = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

type ProductLocation = {
  id: number;
  name: string;
};

type ProductBrand = {
  id: number;
  name: string;
};

type ProductProperty = {
  id: number,
  name: string,
}

export type { Product, ProductGroup, ProductLocation, ProductBrand, ProductProperty };
