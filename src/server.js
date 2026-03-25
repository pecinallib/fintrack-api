import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import { authGuard } from './middlewares/auth.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota pública
app.get('/', (req, res) => {
  return res.json({
    message: 'FinTrack API rodando',
    version: '0.1.0',
  });
});

// Rotas de autenticação (públicas)
app.use('/auth', authRoutes);

// Todas as rotas abaixo precisam de token
app.use(authGuard);

app.use('/transactions/summary', summaryRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);

// 404 handler
app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido no body da requisição',
      details: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
