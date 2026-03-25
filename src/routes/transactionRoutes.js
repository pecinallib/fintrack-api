import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { validate } from '../middlewares/validate.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validations/transactionValidation.js';

const router = Router();

router.get('/', transactionController.index);
router.get('/:id', transactionController.show);
router.post(
  '/',
  validate(createTransactionSchema),
  transactionController.store,
);
router.put(
  '/:id',
  validate(updateTransactionSchema),
  transactionController.update,
);
router.delete('/:id', transactionController.remove);

export default router;
