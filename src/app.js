require('dotenv').config();
const express = require('express');
const app = express(); // <- ESSENCIAL
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const os = require('os');
const db = require('../db');

// Configurações e middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
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
app.get('/maintenance/new', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'new-maintenance.html'));
});

app.get('/maintenance/list', async (req, res, next) => {
  try {
    const results = await db.selectJanelas();
    res.json(results);
  } catch (error) {
    next(error);
  }
});


app.get('/api/maintenance/list/:janelaId', async (req, res, next) => {
  const { janelaId } = req.params;
  const results = await db.selectJanelaById(janelaId);
  res.json(results);
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota para servir a página HTML
app.get('/maintenance/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'details-maintenance.html'));
});

// chamando as routas


const maintenanceRoutes = require('./routes/maintenance');
app.use(maintenanceRoutes);

const searchHostRoutes = require('./routes/search_host');
app.use('/', searchHostRoutes);



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