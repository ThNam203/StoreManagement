import Product from "./Product";

interface ProductProperty {
    id: number;
    name: string;
    value: string;
    products: Set<Product>;
}

export default ProductProperty