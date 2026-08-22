import type { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { createProductSchema } from './products.types';

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  allProducts = async (req: Request, res: Response) => {
    const products = await this.productsService.getProducts();

    res.json(products);
  };

  getProduct = async (req: Request, res: Response) => {
    const product = await this.productsService.getProduct(req.params.id);

    if (!product) {
      res.status(404).json({
        message: 'Order not found',
      });

      return;
    }

    res.json(product);
  };

  createProduct = async (req: Request, res: Response) => {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid request',
        errors: result.error.flatten(),
      });

      return;
    }

    const { name, price, description, category, imageUrl, inventoryCount } =
      result.data;
    const order = await this.productsService.createProduct(
      name,
      inventoryCount,
      price,
      category,
      imageUrl,
      description,
    );

    res.status(201).json(order);
  };
}
