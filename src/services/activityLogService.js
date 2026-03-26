import prisma from '../utils/prisma.js';

export async function log({ action, entity, entityId, details, userId }) {
  return await prisma.activityLog.create({
    data: { action, entity, entityId, details, userId },
  });
}

export async function getRecent(userId, limit = 20) {
  return await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
