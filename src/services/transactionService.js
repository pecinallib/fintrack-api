import prisma from '../utils/prisma.js';
import * as activityLogService from './activityLogService.js';

const TYPE_LABELS = {
  income: 'Receita',
  expense: 'Despesa',
};

export async function findAll(userId) {
  return await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id) {
  return await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function create({ title, amount, type, categoryId, userId }) {
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      title,
      amount,
      type,
      userId,
      categoryId: categoryId || null,
    },
    include: { category: true },
  });

  await activityLogService.log({
    action: 'create',
    entity: 'transaction',
    entityId: transaction.id,
    details: `Criou ${TYPE_LABELS[type]}: "${title}" — R$ ${amount.toFixed(2)}`,
    userId,
  });

  return transaction;
}

export async function update(id, data, userId) {
  const old = await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!old) return null;

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      title: data.title || undefined,
      amount: data.amount !== undefined ? data.amount : undefined,
      type: data.type || undefined,
      categoryId: data.categoryId !== undefined ? data.categoryId : undefined,
    },
    include: { category: true },
  });

  const changes = [];

  if (data.title && data.title !== old.title) {
    changes.push(`título: "${old.title}" → "${data.title}"`);
  }

  if (data.amount !== undefined && data.amount !== old.amount) {
    changes.push(
      `valor: R$ ${old.amount.toFixed(2)} → R$ ${data.amount.toFixed(2)}`,
    );
  }

  if (data.type && data.type !== old.type) {
    changes.push(`tipo: ${TYPE_LABELS[old.type]} → ${TYPE_LABELS[data.type]}`);
  }

  if (data.categoryId !== undefined && data.categoryId !== old.categoryId) {
    const oldCat = old.category?.name || 'Sem categoria';
    const newCat = updated.category?.name || 'Sem categoria';
    changes.push(`categoria: ${oldCat} → ${newCat}`);
  }

  const details =
    changes.length > 0
      ? `Editou transação "${updated.title}": ${changes.join(', ')}`
      : `Editou transação "${updated.title}" (sem alterações)`;

  await activityLogService.log({
    action: 'update',
    entity: 'transaction',
    entityId: id,
    details,
    userId,
  });

  return updated;
}

export async function remove(id, userId) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) return null;

  await prisma.transaction.delete({ where: { id } });

  await activityLogService.log({
    action: 'delete',
    entity: 'transaction',
    entityId: id,
    details: `Deletou ${TYPE_LABELS[transaction.type]}: "${transaction.title}" — R$ ${transaction.amount.toFixed(2)}`,
    userId,
  });

  return transaction;
}
