import * as summaryService from '../services/summaryService.js';

export async function index(req, res) {
  const summary = await summaryService.getSummary(1); // userId temporário
  return res.json(summary);
}
