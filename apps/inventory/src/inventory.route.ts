import { Router } from 'express';
import { prisma } from './infrastructure/db/prisma';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

const router = Router();

const repository = new InventoryRepository(prisma);

const service = new InventoryService(repository);

const controller = new InventoryController(service);

router.post('/reserve', controller.reserve);

export const InventoryRouter = router;
