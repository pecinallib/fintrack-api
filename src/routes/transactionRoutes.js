import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = Router();

router.get('/', transactionController.index);
router.get('/:id', transactionController.show);
router.post('/', transactionController.store);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.remove);

export default router;
