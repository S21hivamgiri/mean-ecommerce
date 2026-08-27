// eslint-disable-next-line
import { Product, PaginatedResponse } from '@myCommerce/models';
import { ProductsRepository } from './products.repository';
import { randomUUID } from 'crypto';

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getPaginatedProducts(
    pageQuery?: string,
    limit?: string,
  ): Promise<PaginatedResponse<Product>> {
    const currentPageNumber = Math.max(1, parseInt(pageQuery || '1', 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(limit || '10', 10)),
    );

    const { items, total } = await this.productsRepository.findPaginated(
      currentPageNumber,
      pageSize,
    );

    return {
      items,
      total,
      pageSize,
      page: currentPageNumber,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getCategories(): Promise<string[]> {
    return this.productsRepository.findCategories();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.productsRepository.findById(id);
  }

  async createProduct(
    name: string,
    price: number,
    category: string,
    imageUrl: string,
    description?: string,
  ): Promise<Product> {
    if (price < 0) {
      throw new Error('Product price must be positive');
    }

    const product: Product = {
      id: randomUUID(),
      name,
      description,
      category,
      imageUrl,
      price,
      inStock: true,
      reviewCount: 0,
      rating: 0,
    };

    return this.productsRepository.create(product);
  }
}
