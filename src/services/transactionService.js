let transactions = [];
let nextId = 1;

export function findAll() {
  return transactions;
}

export function findById(id) {
  return transactions.find((t) => t.id === id);
}

export function create({ title, amount, type, category }) {
  const transaction = {
    id: nextId++,
    title,
    amount: Number(amount),
    type,
    category: category || 'Outros',
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);
  return transaction;
}

export function update(id, data) {
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) return null;

  transactions[index] = {
    ...transactions[index],
    title: data.title || transactions[index].title,
    amount:
      data.amount !== undefined
        ? Number(data.amount)
        : transactions[index].amount,
    type: data.type || transactions[index].type,
    category: data.category || transactions[index].category,
  };

  return transactions[index];
}

export function remove(id) {
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) return null;

  const deleted = transactions.splice(index, 1)[0];
  return deleted;
}
