import express from 'express';

const app = express();
const PORT = 3000;

// Middleware pra entender JSON no body das requests
app.use(express.json());

// Rota de health check
app.get('/', (req, res) => {
  return res.json({
    message: 'FinTrack API',
    version: '0.1.0',
  });
});

app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
