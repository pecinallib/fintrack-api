import * as summaryService from '../services/summaryService.js';

export async function index(req, res) {
  const { dateFrom, dateTo } = req.query;

  const summary = await summaryService.getSummary(req.userId, {
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  return res.json(summary);
}
