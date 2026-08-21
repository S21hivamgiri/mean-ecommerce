import type { Product } from '@myCommerce/models';

export class ProductsRepository {
  private products: Product[] = [];

  findAll(): Product[] {
    return this.products;
  }

  findById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  create(product: Product): Product {
    this.products.push(product);

    return product;
  }
}
