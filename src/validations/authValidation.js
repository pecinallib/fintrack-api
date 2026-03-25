import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  password: z.string({ required_error: 'Senha é obrigatória' }),
});
