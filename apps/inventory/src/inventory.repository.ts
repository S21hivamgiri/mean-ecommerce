import { PrismaClient } from '@prisma/client';


export class InventoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByProductId(productId: string) {
    return this.prisma.inventory.findUnique({
      where: {
        productId,
      },
    });
  }

  async reserve(productId: string, quantity: number) {
    return this.prisma.inventory.update({
      where: {
        productId,
      },
      data: {
        reserved: {
          increment: quantity,
        },
      },
    });
  }
}
