import Product from "./Product";

interface ProductBrand {
    id: number;
    name: string;
    products: Set<Product>;
}

export default ProductBrand