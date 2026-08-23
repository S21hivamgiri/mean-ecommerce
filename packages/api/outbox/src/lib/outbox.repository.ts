import { PrismaClient } from '@prisma/client';

export class OutboxRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getUnprocessedEvents() {
    return this.prisma.outboxEvent.findMany({
      where: {
        processedAt: null,
      },

      orderBy: {
        createdAt: 'asc',
      },

      take: 100,
    });
  }

  async markProcessed(id: string) {
    return this.prisma.outboxEvent.update({
      where: {
        id,
      },

      data: {
        processedAt: new Date(),
      },
    });
  }
}
