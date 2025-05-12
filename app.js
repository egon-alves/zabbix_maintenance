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
app.set('view engine', 'ejs');


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

// Rota para listar todas as janelas de manutenção
app.get("/list-maintenance", async (req, res) => {
  try {
      // Chama a função do banco de dados para buscar todas as janelas
      const results = await db.selectJanelas();

      // Retorna os resultados em formato JSON
      res.json(results);
  } catch (error) {
      // Em caso de erro, exibe a mensagem no console
      console.error("Erro ao buscar janelas:", error);

      // Retorna erro 500 com mensagem genérica
      res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// Rota para listar uma janela de manutenção específica por ID

app.get("/list-maintenance-id/:id", async (req, res) => {
  try {
    // Extrai o parâmetro ID da URL
    const { id } = req.params;

    // Busca a janela no banco de dados com base no ID fornecido
    const results = await db.selectJanelaById(id);

    // Se não encontrar nenhuma janela com o ID, retorna erro 404
    if (results.length === 0) {
      return res.status(404).json({ message: "Janela não encontrada." });
    }

    // Retorna os dados da janela encontrada em formato JSON
    res.json(results);
  } catch (error) {
    // Em caso de erro, exibe a mensagem no console
    console.error("Erro ao buscar janela por ID:", error);

    // Retorna erro 500 com mensagem genérica
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});


// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
