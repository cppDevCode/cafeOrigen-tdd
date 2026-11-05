import { Router } from 'express';
import { TestingController } from '../controller/testing.controller.js';

export function createTestingRouter(): Router {
  const router = Router();
  const controller = new TestingController();

  router.post('/reset', controller.reset);
  router.post('/seed', controller.seed);

  return router;
}