import * as transactionService from '../services/transactionService.js';

export async function index(req, res) {
  const transactions = await transactionService.findAll();
  return res.json(transactions);
}

export async function show(req, res) {
  const transaction = await transactionService.findById(Number(req.params.id));

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
}

export async function store(req, res) {
  const transaction = await transactionService.create(req.body);
  return res.status(201).json(transaction);
}

export async function update(req, res) {
  const transaction = await transactionService.update(
    Number(req.params.id),
    req.body,
  );

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
}

export async function remove(req, res) {
  const transaction = await transactionService.remove(Number(req.params.id));

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json({
    message: 'Transação deletada com sucesso',
    deleted: transaction,
  });
}
