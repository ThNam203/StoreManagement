import Media from "./Media";
import ProductBrand from "./ProductBrand";
import ProductGroup from "./ProductGroup";
import ProductProperty from "./ProductProperty";

interface Product {
  id: number;
  name: string;
  barcode: string;
  location: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
  status: string;
  description: string;
  note: string;
  minQuantity: number;
  maxQuantity: number;
  productGroup: ProductGroup;
  productBrand: ProductBrand;
  productProperty: ProductProperty;
  images: Set<Media>;
}

export default Product;
