const express = require('express');
const app = express.Router();
const { inserirManutencao, updateStatusJanela} = require('../../db');
const { createMaintenanceZabbix } = require('../services/zabbix');
require('dotenv').config();
const { enviarMensagemTeams } = require('./teams');


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
  await enviarMensagemTeams(solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao);

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



app.post('/api/maintenance/zabbix/new', async (req, res) => {
  res.send("TESTE");
});

app.post('/api/maintenance/list/:janelaId/aceitar', async (req, res) => {
  try {
    const { janelaId } = req.params;

    // Chamar a própria API local para buscar os dados da janela
    const response = await fetch(`${process.env.API_URL}/api/maintenance/list/${janelaId}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Falha ao obter janela' });
    }

    const data = await response.json();
    const janela = data[0]; // assumindo que o retorno é um array com 1 item

    if (!janela) {
      return res.status(404).json({ error: 'Dados da janela vazios' });
    }

    // Atualiza o status da janela para aceito    
    await updateStatusJanela(janelaId, 'aceito');  
    const resultado = await createMaintenanceZabbix(janela);

    

    res.json({ sucesso: true, resultado });
  } catch (err) {
    console.error('Erro ao criar manutenção no Zabbix:', err);
    res.status(500).json({ error: 'Erro interno ao criar manutenção' });
  }
});




module.exports = app;
