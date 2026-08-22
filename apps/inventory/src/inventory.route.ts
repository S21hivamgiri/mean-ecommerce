import { Router } from 'express';

import { prisma } from './infrastructure/db/prisma';
import { InventoryController } from '@myCommerce/api-products';
import { InventoryRepository } from '@myCommerce/api-products';
import { InventoryService } from '@myCommerce/api-products';

const router = Router();

const repository = new InventoryRepository(prisma);

const service = new InventoryService(repository);

const controller = new InventoryController(service);

router.post('/reserve', controller.reserve);

export const InventoryRouter = router;
