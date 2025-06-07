// src/services/zabbix.js
const axios = require('axios');
require('dotenv').config({ path: require('path').join(__dirname, '..', 'config', 'pass.env') });

const ZABBIX_URL = process.env.ZABBIX_URL;
const ZABBIX_USER = process.env.ZABBIX_USER;
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD;

let authToken = null;

// Função para autenticar com usuario zabbix.
async function authenticateZabbix() {
  if (authToken) return authToken;

  const response = await axios.post(ZABBIX_URL, {
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      user: ZABBIX_USER,
      password: ZABBIX_PASSWORD
    },
    id: 1,
    auth: null
  });

  authToken = response.data.result;
  return authToken;
}

async function searchHosts(query) {
  const token = await authenticateZabbix();

  try {
    const response = await axios.post(ZABBIX_URL, {
      jsonrpc: "2.0",
      method: "host.get",
      params: {
        output: ['name'],
        search: {
          name: query
        },
        filter: {
          status: "0" // Filtra apenas hosts com status 0 (ativo)
        },
        limit: 100
      },
      id: 2,
      auth: token
    });

    // Verifica se a resposta contém dados e retorna uma lista válida
    if (response.data && response.data.result && Array.isArray(response.data.result)) {
      return response.data.result.map(host => ({
        hostid: host.hostid,
        name: host.name
      }));
    } else {
      console.error('A resposta não contém hosts válidos', response.data);
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar hosts:', error);
    return [];
  }
}

// Essa função já pode estar no seu arquivo de conexão Zabbix
async function createMaintenanceZabbix(janela) {
  const token = await authenticateZabbix();
  const {
    inicio_agendamento,
    fim_agendamento,
    solicitante_email,
    chamado,
    ids_host,
    observacao
  } = janela;

  // Calcular período em segundos (duração da manutenção)
  const inicio = new Date(inicio_agendamento).getTime() / 1000;
  const fim = new Date(fim_agendamento).getTime() / 1000;
  const periodo = Math.floor(fim - inicio);

  // Montar payload da API Zabbix
  const payload = {
    jsonrpc: '2.0',
    method: 'maintenance.create',
    params: {
      name: `Auto: ${chamado}`,
      active_since: inicio,
      active_till: fim,
      tags_evaltype: 0,
      description: `Solicitante ${solicitante_email} : ${observacao}`,
      hostids: ids_host.split(','),
      timeperiods: [
        {
          timeperiod_type: 0,
          period: periodo,
        }
      ]
    },
    auth: token,
    id: 1,
  };

  // Enviar requisição para API do Zabbix
  const response = await axios.post(ZABBIX_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}




// Exportar as funções
module.exports = {
  searchHosts,createMaintenanceZabbix
};
