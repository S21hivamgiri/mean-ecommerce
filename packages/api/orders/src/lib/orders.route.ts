import { Router } from 'express';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';

const router = Router();

const repository = new OrdersRepository();
const service = new OrdersService(repository);
const controller = new OrdersController(service);

router.get('/', controller.getOrders);

router.get('/:id', controller.getOrder);

router.post('/', controller.createOrder);

export const ordersRouter = router;
