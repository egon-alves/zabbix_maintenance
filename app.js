const express = require('express');
const path = require('path');
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const { inserirManutencao, selectJanelas, selectJanelaById } = require("./db");
const { searchHosts } = require('./server');
const { formatarData } = require('./utils/formatarData');

app.use(cors());
app.use(bodyParser.json());

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


// Rota para criar nova janela de manutenção
app.post("/api/maintenance", async (req, res) => {
  try {
    const data = req.body;

    const {
      solicitante_email,
      chamado,
      inicio_agendamento,
      fim_agendamento,
      observacao,
    } = data;

    await inserirManutencao(data);

    const webhookUrl = 'https://sercompecombr.webhook.office.com/webhookb2/aedd2e3f-d6bf-455e-a3f4-e80088f890f7@d57e32fb-6c5f-414c-9811-cb2164a80faa/IncomingWebhook/e86ef06cbe914d789ec45067493cb7a0/04878ae3-1c87-40bd-8b43-9da040811242/V20cbdQolI5hP2heWrDf2ZKrrK2vI9k5iq92M-I1JKk1w1';

    const inicioFormatado = formatarData(inicio_agendamento);
    const fimFormatado = formatarData(fim_agendamento);
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🛠️ <b>Nova manutenção criada por APP.js</b><br><br>` +
              `👤 <b>Solicitante</b>: ${solicitante_email}<br>` +
              `📄 <b>Chamado</b>: ${chamado}<br>` +
              `⏰ <b>Início</b>: ${inicio_agendamento}<br>` +
              `⏳ <b>Fim</b>: ${fim_agendamento}<br>` +
              `📝 <b>Observação</b>: ${observacao}<br><br>` +
              `🔗 <b>Link para manutenção</b>: <a href="http://localhost:${PORT}/list-maintenance.html">Clique aqui</a>`
      })
    });
    
    
    res.status(200).json({ message: "Manutenção criada com sucesso" });

  } catch (error) {
    console.error("Erro ao criar manutenção", error);
    res.status(500).json({ message: error.message || "Erro interno do servidor" });
  }
});

// Rota para pegar o nome do notebook
const os = require('os');
app.get('/name', (req, res) => {
  // Pega o hostname da máquina que está rodando o servidor
  const hostname = os.hostname();
  
  res.send(`O hostname da máquina que está acessando é: ${hostname}`);
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
