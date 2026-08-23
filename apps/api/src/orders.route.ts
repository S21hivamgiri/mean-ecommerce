import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { InventoryClient } from './infrastructure/client/inventory.client';
import { prisma } from './infrastructure/db/prisma';
const INVENTORY_SERVICE_URL = 'http://localhost:4444';

const router = Router();
const repository = new OrdersRepository(prisma);
const client = new InventoryClient(INVENTORY_SERVICE_URL);
const service = new OrdersService(repository, client);
const controller = new OrdersController(service);

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrder);
router.post('/', controller.createOrder);

export const OrdersRouter = router;
