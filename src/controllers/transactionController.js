import * as transactionService from '../services/transactionService.js';

export function index(req, res) {
  const transactions = transactionService.findAll();
  return res.json(transactions);
}

export function show(req, res) {
  const transaction = transactionService.findById(Number(req.params.id));

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
}

export function store(req, res) {
  const transaction = transactionService.create(req.body);
  return res.status(201).json(transaction);
}

export function update(req, res) {
  const transaction = transactionService.update(
    Number(req.params.id),
    req.body,
  );

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
}

export function remove(req, res) {
  const transaction = transactionService.remove(Number(req.params.id));

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json({
    message: 'Transação deletada com sucesso',
    deleted: transaction,
  });
}
