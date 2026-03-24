import { Router } from 'express';

const router = Router();

// Banco de dados temporário (em memória por enquanto)
let transactions = [];
let nextId = 1;

// GET /transactions — listar todas
router.get('/', (req, res) => {
  return res.json(transactions);
});

// GET /transactions/:id — buscar uma
router.get('/:id', (req, res) => {
  const transaction = transactions.find((t) => t.id === Number(req.params.id));

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
});

// POST /transactions — criar nova
router.post('/', (req, res) => {
  const { title, amount, type, category } = req.body;

  if (!title || amount === undefined || !type) {
    return res
      .status(400)
      .json({ error: 'Campos obrigatórios: title, amount, type' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res
      .status(400)
      .json({ error: "Type deve ser 'income' ou 'expense'" });
  }

  const transaction = {
    id: nextId++,
    title,
    amount: Number(amount),
    type,
    category: category || 'Outros',
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);
  return res.status(201).json(transaction);
});

// PUT /transactions/:id — atualizar
router.put('/:id', (req, res) => {
  const index = transactions.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  const { title, amount, type, category } = req.body;

  if (type && type !== 'income' && type !== 'expense') {
    return res
      .status(400)
      .json({ error: "Type deve ser 'income' ou 'expense'" });
  }

  transactions[index] = {
    ...transactions[index],
    title: title || transactions[index].title,
    amount: amount !== undefined ? Number(amount) : transactions[index].amount,
    type: type || transactions[index].type,
    category: category || transactions[index].category,
  };

  return res.json(transactions[index]);
});

// DELETE /transactions/:id — deletar
router.delete('/:id', (req, res) => {
  const index = transactions.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  transactions.splice(index, 1);
  return res.status(204).send();
});

export default router;
