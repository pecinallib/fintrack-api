import prisma from '../utils/prisma.js';
import * as activityLogService from './activityLogService.js';

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
    details: `Criou transação "${title}" - R$ ${amount} (${type})`,
    userId,
  });

  return transaction;
}

export async function update(id, data, userId) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) return null;

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

  await activityLogService.log({
    action: 'update',
    entity: 'transaction',
    entityId: id,
    details: `Editou transação "${updated.title}"`,
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
    details: `Deletou transação "${transaction.title}"`,
    userId,
  });

  return transaction;
}
