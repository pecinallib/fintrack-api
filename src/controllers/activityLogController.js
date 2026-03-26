import * as activityLogService from '../services/activityLogService.js';

export async function index(req, res) {
  const logs = await activityLogService.getRecent(req.userId);
  return res.json(logs);
}
