import { createServer } from 'node:http';

const server = createServer((req, res) => {
  const { method, url } = req;

  // Seta o header pra JSON em todas as respostas
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/') {
    res.writeHead(200);
    return res.end(
      JSON.stringify({
        message: 'FinTrack API rodando',
        version: '0.1.0',
      }),
    );
  }

  // Qualquer outra rota = 404
  res.writeHead(404);
  return res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
