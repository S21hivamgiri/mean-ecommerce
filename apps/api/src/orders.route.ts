import { Router } from 'express';
import {
  OrdersController,
  OrdersService,
  OrdersRepository,
  InventoryClient,
} from '@myCommerce/api-orders';
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
