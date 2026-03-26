import { Router } from 'express';
import * as activityLogController from '../controllers/activityLogController.js';

const router = Router();

router.get('/', activityLogController.index);

export default router;
