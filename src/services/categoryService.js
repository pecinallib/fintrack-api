import prisma from '../utils/prisma.js';

export async function findAll(userId) {
  return await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function findById(id) {
  return await prisma.category.findUnique({
    where: { id },
  });
}

export async function create({ name, userId }) {
  const existing = await prisma.category.findFirst({
    where: { name, userId },
  });

  if (existing) {
    throw new Error('CATEGORY_ALREADY_EXISTS');
  }

  return await prisma.category.create({
    data: { name, userId },
  });
}

export async function update(id, { name }) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) return null;

  return await prisma.category.update({
    where: { id },
    data: { name },
  });
}

export async function remove(id) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) return null;

  return await prisma.category.delete({
    where: { id },
  });
}
