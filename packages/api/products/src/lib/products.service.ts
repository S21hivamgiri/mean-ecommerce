// eslint-disable-next-line
import { Product } from '@myCommerce/models';
import { ProductsRepository } from './products.repository';
import { randomUUID } from 'crypto';

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  private products: Product[] = [];
  // getProducts(filter?: ProductFilter, page = 1, pageSize = 10) {
  //   let filteredProducts = [...this.products];

  //   // Apply filters
  //   if (filter) {
  //     if (filter.category) {
  //       filteredProducts = filteredProducts.filter(
  //         (p) => p.category === filter.category,
  //       );
  //     }
  //     if (filter.minPrice !== undefined) {
  //       const minPrice = filter.minPrice;
  //       filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  //     }
  //     if (filter.maxPrice !== undefined) {
  //       const maxPrice = filter.maxPrice;
  //       filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  //     }
  //     if (filter.inStock !== undefined) {
  //       filteredProducts = filteredProducts.filter(
  //         (p) => p.inStock === filter.inStock,
  //       );
  //     }
  //     if (filter.searchTerm) {
  //       const searchLower = filter.searchTerm.toLowerCase();
  //       filteredProducts = filteredProducts.filter(
  //         (p) =>
  //           p.name.toLowerCase().includes(searchLower) ||
  //           p.description?.toLowerCase().includes(searchLower) ||
  //           p.category.toLowerCase().includes(searchLower),
  //       );
  //     }
  //   }

  //   // Calculate pagination
  //   const total = filteredProducts.length;
  //   const totalPages = Math.ceil(total / pageSize);
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   const items = filteredProducts.slice(startIndex, endIndex);

  //   return {
  //     items,
  //     total,
  //     page,
  //     pageSize,
  //     totalPages,
  //   };
  // }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getCategories(): string[] {
    const categories = new Set(this.products.map((p) => p.category));
    return Array.from(categories).sort();
  }

  async getProducts(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }

  async createProduct(
    name: string,
    price: number,
    inventoryCount: number,
    category: string,
    imageUrl: string,
    description?: string,
  ): Promise<Product> {
    if (inventoryCount <= 0) {
      throw new Error('Product Inventory Count must be greater than zero');
    }
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
      inventoryCount,
      inStock: true,
      reviewCount: 0,
      rating: 0,
    };

    return this.productsRepository.create(product);
  }
}
