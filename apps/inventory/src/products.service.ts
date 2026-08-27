// eslint-disable-next-line
import { Product, PaginatedResponse, ProductFilter } from '@myCommerce/models';
import { ProductsRepository } from './products.repository';
import { randomUUID } from 'crypto';

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(
    pageQuery?: string | number,
    pageSizeQuery?: string | number,
    filter?: ProductFilter,
  ): Promise<PaginatedResponse<Product>> {
    const currentPageNumber = Math.max(1, Number(pageQuery) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(pageSizeQuery) || 10));

    const { items, total } = await this.productsRepository.findPaginated(
      currentPageNumber,
      pageSize,
      filter,
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
