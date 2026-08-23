import { InventoryRepository } from './inventory.repository';
import { createLogger } from '@myCommerce/logger';

export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}
  logger = createLogger('inventory-service');

  async reserve(productId: string, quantity: number, requestId:string) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    this.logger.info(
      {
        requestId: requestId,
        productId: productId,
        quantity: quantity,
      },
      'Reserving inventory',
    );
    const inventory = await this.repository.findByProductId(productId);

    if (!inventory) {
      throw new Error('Product inventory not found');
    }

    const available = inventory.quantity - inventory.reserved;

    if (available < quantity) {
      throw new Error('Insufficient inventory');
    }

    return this.repository.reserve(productId, quantity);
  }
}
