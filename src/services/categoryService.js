import prisma from '../utils/prisma.js';
import * as activityLogService from './activityLogService.js';

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
    where: {
      userId,
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw new Error('CATEGORY_ALREADY_EXISTS');
  }

  const category = await prisma.category.create({
    data: { name, userId },
  });

  await activityLogService.log({
    action: 'create',
    entity: 'category',
    entityId: category.id,
    details: `Criou categoria "${name}"`,
    userId,
  });

  return category;
}

export async function update(id, { name }, userId) {
  const old = await prisma.category.findUnique({ where: { id } });

  if (!old) return null;

  const updated = await prisma.category.update({
    where: { id },
    data: { name },
  });

  const details =
    old.name !== name
      ? `Editou categoria: "${old.name}" → "${name}"`
      : `Editou categoria "${name}" (sem alterações)`;

  await activityLogService.log({
    action: 'update',
    entity: 'category',
    entityId: id,
    details,
    userId,
  });

  return updated;
}

export async function remove(id, userId) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) return null;

  await prisma.category.delete({ where: { id } });

  await activityLogService.log({
    action: 'delete',
    entity: 'category',
    entityId: id,
    details: `Deletou categoria "${category.name}"`,
    userId,
  });

  return category;
}
