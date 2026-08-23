import { InventoryRepository } from './inventory.repository';

export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}

  async reserve(productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

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
