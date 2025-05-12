// app.js
const express = require('express');
const path = require('path');
const { searchHosts } = require('./server'); // Importar a função do server.js
require("dotenv").config();
const app = express();
const router = express.Router();

const PORT = 5500;
const HOST = '0.0.0.0';

const viewsPath = path.join(__dirname, 'public');


app.use(express.static(viewsPath));
app.use("/", router);
const db = require("./db");

// Log simples de requisições
router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

// Página principal
router.get("/new-maintenance", function (req, res) {
  res.sendFile(path.join(viewsPath, "new-maintenance.html"));
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


app.get("/list-maintenance", async (req, res) => {
  try {
      const results = await db.selectJanelas();
      res.json(results);
  } catch (error) {
      console.error("Erro ao buscar janelas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/list-maintenance", async (req, res) => {
  const janelaId = req.query.query;

  if (!janelaId) {
    return res.status(400).json({ error: "ID da janela é necessário" });
  }

  try {
    const janela = await db.selectJanelaById(janelaId);
    if (janela.length > 0) {
      res.json(janela);
    } else {
      res.status(404).json({ error: "Janela de manutenção não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao buscar janela:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
