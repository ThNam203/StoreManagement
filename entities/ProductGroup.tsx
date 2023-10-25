import Product from "./Product";

interface ProductGroup {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    // creator: Staff;
    products: Set<Product> ;
}

export default ProductGroup