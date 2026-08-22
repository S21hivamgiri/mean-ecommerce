import type { Product } from '@myCommerce/models';
import { PrismaClient } from '@prisma/client';

export class ProductsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapProduct(product: any): Product {
    return {
      ...product,
      description: product.description ?? undefined,
    };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(this.mapProduct);
  }

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        price: product.price,
        inventoryCount: product.inventoryCount,
        inStock: true,
        reviewCount: 0,
        rating: 0,
      },
    });

    return this.mapProduct(createdProduct);
  }
}
