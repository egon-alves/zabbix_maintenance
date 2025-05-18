const express = require('express');
const app = express.Router();
const { inserirManutencao } = require('../../db');

app.post('/api/maintenance/new-maintenance', async (req, res) => {
  const {
    solicitante_email,
    chamado,
    inicio_agendamento,
    fim_agendamento,
    observacao,
    hosts
  } = req.body;
  console.log('Dados recebidos no backend:', req.body);

  if (!solicitante_email || !inicio_agendamento || !fim_agendamento || !Array.isArray(hosts)) {
    return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
  }

  try {
    const result = await inserirManutencao({
      solicitante_email,
      chamado,
      inicio_agendamento,
      fim_agendamento,
      observacao,
      hosts
    });

    res.status(201).json({ message: 'Manutenção criada com sucesso', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar manutenção.' });
  }
});

module.exports = app;
