// server.js
const express = require('express');
const fetch = require('node-fetch'); // instale com npm install node-fetch
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Seu webhook do Teams
const webhookUrl = 'https://sercompecombr.webhook.office.com/webhookb2/...';

app.post('/api/enviar-para-teams', async (req, res) => {
  const { text } = req.body;

  try {
    const resposta = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text || 'Nova janela foi enviada!' })
    });

    if (!resposta.ok) throw new Error('Erro no envio');

    res.status(200).json({ status: 'Mensagem enviada com sucesso' });
  } catch (erro) {
    console.error('Erro ao enviar:', erro);
    res.status(500).json({ status: 'Erro ao enviar mensagem' });
  }
});

