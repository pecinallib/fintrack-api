import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { sendPasswordResetEmail } from './emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fintrack-secret-dev';

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Sempre retorna sucesso (segurança — não revela se email existe)
  if (!user) return;

  // Invalida tokens anteriores não usados
  await prisma.passwordReset.updateMany({
    where: { email, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Gera token e salva hash
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.passwordReset.create({
    data: {
      email,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    },
  });

  try {
    const result = await sendPasswordResetEmail(email, token);
    console.log('Email de reset enviado:', result);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

export async function resetPassword(token, newPassword) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetRecord) {
    throw new Error('TOKEN_INVALID_OR_EXPIRED');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: resetRecord.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { usedAt: new Date() },
  });
}
