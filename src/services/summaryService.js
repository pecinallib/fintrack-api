import prisma from '../utils/prisma.js';

export async function getSummary(userId) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const byCategory = transactions
    .filter((t) => t.type === 'expense' && t.category)
    .reduce((acc, t) => {
      const name = t.category.name;
      acc[name] = (acc[name] || 0) + t.amount;
      return acc;
    }, {});

  return {
    totalIncome,
    totalExpense,
    balance,
    transactionCount: transactions.length,
    expensesByCategory: byCategory,
  };
}
