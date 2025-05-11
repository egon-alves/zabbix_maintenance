// server.js
const axios = require('axios');



require('dotenv').config({ path: './config/pass.env' });
const ZABBIX_URL = process.env.ZABBIX_URL;
const ZABBIX_USER = process.env.ZABBIX_USER;
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD;

/*
const ZABBIX_URL = 'http://192.168.1.33:8181/api_jsonrpc.php';
const ZABBIX_USER = 'Admin';
const ZABBIX_PASSWORD = 'zabbix';
*/


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

// Exportar as funções
module.exports = {
  searchHosts
};
