import prisma from '../utils/prisma.js';

export async function findAll() {
  return await prisma.transaction.findMany({
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

export async function create({ title, amount, type, categoryId }) {
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
  }

  return await prisma.transaction.create({
    data: {
      title,
      amount,
      type,
      userId: 1,
      categoryId: categoryId || null,
    },
    include: { category: true },
  });
}

export async function update(id, data) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) return null;

  return await prisma.transaction.update({
    where: { id },
    data: {
      title: data.title || undefined,
      amount: data.amount !== undefined ? data.amount : undefined,
      type: data.type || undefined,
    },
    include: { category: true },
  });
}

export async function remove(id) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) return null;

  return await prisma.transaction.delete({
    where: { id },
  });
}
