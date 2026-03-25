import { z } from 'zod';

export const createTransactionSchema = z.object({
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(2, 'Título deve ter pelo menos 2 caracteres'),
  amount: z
    .number({ required_error: 'Valor é obrigatório' })
    .positive('Valor deve ser positivo'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type deve ser 'income' ou 'expense'" }),
  }),
  categoryId: z.number().int().positive().optional(),
});

export const updateTransactionSchema = z.object({
  title: z
    .string()
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .optional(),
  amount: z.number().positive('Valor deve ser positivo').optional(),
  type: z
    .enum(['income', 'expense'], {
      errorMap: () => ({ message: "Type deve ser 'income' ou 'expense'" }),
    })
    .optional(),
  category: z.string().optional(),
});
