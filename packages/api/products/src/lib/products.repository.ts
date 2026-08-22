import type { Product } from '@myCommerce/models';
import { PrismaClient } from '@prisma/client';

export class ProductsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        id: product.id,
        name :product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        price: product.price,
        inventoryCount: product.inventoryCount,
        inStock: true,
        reviewCount: 0,
        rating: 0,
      },
    });

    return {
      ...createdProduct,
      description: createdProduct.description ?? undefined,
    };
  }
}
