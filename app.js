require('dotenv').config();
const express = require('express');
const app = express(); // <- ESSENCIAL
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const os = require('os');
const { searchHosts } = require('./server');
const db = require('./db');

// Configurações e middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// configuração do host 

const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas
app.get('/new-maintenance', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'new-maintenance.html'));
});

app.get('/list-maintenance', async (req, res, next) => {
  try {
    const results = await db.selectJanelas();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// chamando as routas

const maintenanceRoutes = require('./routes/maintenance');
app.use(maintenanceRoutes);


app.get('/search-hosts', async (req, res, next) => {
  try {
    const query = req.query.query || '';
    if (!query) return res.status(400).json({ error: 'Query is required' });
    const hosts = await searchHosts(query);
    res.json(hosts);
  } catch (error) {
    next(error);
  }
});

app.get('/name', (req, res) => {
  res.send(`O hostname da máquina que está acessando é: ${os.hostname()}`);
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
  })