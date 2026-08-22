export class InventoryClient {
  constructor(private readonly baseUrl: string) {}

  async reserve(productId: string, quantity: number) {
    const response = await fetch(`${this.baseUrl}/inventory/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Inventory service failed: ${response.status}`);
    }

    return response.json();
  }
}
