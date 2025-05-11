// app.js
const express = require('express');
const path = require('path');
const { searchHosts } = require('./server'); // Importar a função do server.js

const app = express();
const router = express.Router();

const PORT = 5500;
const HOST = '0.0.0.0';

const viewsPath = path.join(__dirname, 'views');

app.use(express.static(viewsPath));
app.use("/", router);

// Log simples de requisições
router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

// Página principal
router.get("/", function (req, res) {
  res.sendFile(path.join(viewsPath, "index.html"));
});

// Rota de busca de hosts
router.get("/search-hosts", async (req, res) => {
  try {
    const query = req.query.query || '';
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const hosts = await searchHosts(query);
    res.json(hosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch hosts' });
  }
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
