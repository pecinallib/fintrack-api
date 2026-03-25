import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { validate } from '../middlewares/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/categoryValidation.js';

const router = Router();

router.get('/', categoryController.index);
router.get('/:id', categoryController.show);
router.post('/', validate(createCategorySchema), categoryController.store);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
