import { Router } from 'express';

import {
  OrdersController,
  OrdersService,
  OrdersRepository,
} from '@myCommerce/api-orders';
import { prisma } from './infrastructure/db/prisma';

const router = Router();

const repository = new OrdersRepository(prisma);
const service = new OrdersService(repository);
const controller = new OrdersController(service);

router.get('/', controller.getOrders);

router.get('/:id', controller.getOrder);

router.post('/', controller.createOrder);

export const OrdersRouter = router;
