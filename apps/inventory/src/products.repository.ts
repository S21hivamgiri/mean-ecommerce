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

  async findCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return categories.map((data) => data.category);
  }

  async findById(id: string): Promise<Product | undefined> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    return product ? this.mapProduct(product) : undefined;
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    items: Product[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return { items: items.map(this.mapProduct), total };
  }

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        price: product.price,
        inStock: true,
        reviewCount: 0,
        rating: 0,
      },
    });

    return this.mapProduct(createdProduct);
  }
}
