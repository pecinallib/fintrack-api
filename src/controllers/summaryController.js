import * as summaryService from '../services/summaryService.js';

export async function index(req, res) {
  const summary = await summaryService.getSummary(req.userId);
  return res.json(summary);
}
