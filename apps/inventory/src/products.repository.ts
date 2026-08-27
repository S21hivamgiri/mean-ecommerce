import type { Product, ProductFilter } from '@myCommerce/models';
import { PrismaClient, Prisma } from '@prisma/client';

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
    pageSize: number,
    filter: ProductFilter = {},
  ): Promise<{
    items: Product[];
    total: number;
  }> {
    const skip = (page - 1) * pageSize;

    // Dynamically build Prisma's where clause
    const where: Prisma.ProductWhereInput = {};

    if (filter.category) {
      where.category = { equals: filter.category, mode: 'insensitive' };
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {
        gte: filter.minPrice,
        lte: filter.maxPrice,
      };
    }

    if (filter.inStock !== undefined) {
      where.inStock = filter.inStock;
    }

    if (filter.searchTerm) {
      where.OR = [
        { name: { contains: filter.searchTerm, mode: 'insensitive' } },
        { description: { contains: filter.searchTerm, mode: 'insensitive' } },
        { category: { contains: filter.searchTerm, mode: 'insensitive' } },
      ];
    }

    // Single query execution for both filtered count and filtered dataset
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
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
