import Media from "./Media";
import ProductBrand from "./ProductBrand";
import ProductGroup from "./ProductGroup";
import ProductProperty from "./ProductProperty";

interface Product {
  id: number;
  name: string;
  barcode: string;
  location: string;
  costOfGoods: number; // originalPrice
  sellingPrice: number;
  quantity: number;
  status: string;
  description: string;
  note: string;
  minInventoryThreshold: number; // minQuantity
  maxInventoryThreshold: number; // maxQuantity
  productGroup: string;
  productBrand: string;
  productProperty: string;
  images: Set<Media>;
}

export default Product;
